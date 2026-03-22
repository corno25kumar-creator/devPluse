import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/user.model'
import { RefreshToken } from '../models/refreshToken.model'
import { generateTokens, getRefreshTokenExpiry } from '../utils/generateTokens'
import { setAuthCookies, clearAuthCookies } from '../utils/cookies'
import { generateOTP, verifyOTP, canResendOTP, getResendCooldown } from '../utils/otp'
import { sendOTPEmail, sendPasswordResetEmail, sendSecurityAlertEmail } from '../utils/email'
import { AppError } from '../middleware/errorHandler'
import {
  RegisterInput,
  LoginInput,
  VerifyOTPInput,
  ResendOTPInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '../schemas/auth.schema'

const BCRYPT_ROUNDS = 12

// ── Register ───────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, username, email, password } = req.body as RegisterInput

  // check email unique
  const existingEmail = await User.findOne({ email })
  if (existingEmail) {
    throw new AppError('Email already registered', 409)
  }

  // check username unique
  const existingUsername = await User.findOne({ username })
  if (existingUsername) {
    throw new AppError('Username already taken', 409)
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)

  // generate OTP
  const { otp, hashedOtp, otpExpiry } = await generateOTP()

  // create user
  const user = await User.create({
    name,
    username,
    email,
    passwordHash,
    otp: hashedOtp,
    otpExpiry,
    otpAttempts: 0,
    otpLastSent: new Date(),
    isVerified: false,
  })

  // send OTP email — never block registration if email fails
  const emailResult = await sendOTPEmail(email, name, otp)
  if (!emailResult.success) {
    console.error('❌ OTP email failed for:', email)
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: { email: user.email },
  })
}

// ── Verify OTP ─────────────────────────────────────────────────────
export const verifyOTPHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body as VerifyOTPInput

  // find user
  const user = await User.findOne({ email }).select(
    '+otp +otpExpiry +otpAttempts +isVerified'
  )
  if (!user) {
    throw new AppError('Invalid credentials', 400)
  }

  // already verified
  if (user.isVerified) {
    throw new AppError('Email already verified. Please login.', 400)
  }

  // check OTP exists
  if (!user.otp || !user.otpExpiry) {
    throw new AppError('No OTP found. Please request a new one.', 400)
  }

  // check attempts
  if (user.otpAttempts >= 5) {
    throw new AppError('Too many attempts. Please request a new OTP.', 400)
  }

  // verify OTP
  const { valid, expired } = await verifyOTP(otp, user.otp, user.otpExpiry)

  if (expired) {
    // clear expired OTP
    user.otp = null as any
    user.otpExpiry = null as any
    user.otpAttempts = 0
    await user.save()
    throw new AppError('OTP has expired. Please request a new one.', 400)
  }

  if (!valid) {
    // increment attempts
    user.otpAttempts += 1
    await user.save()
    const remaining = 5 - user.otpAttempts
    throw new AppError(
      remaining > 0
        ? `Invalid OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
        : 'Too many attempts. Please request a new OTP.',
      400
    )
  }

  // OTP valid — mark verified + clear OTP fields
  user.isVerified = true
  user.otp = null as any
  user.otpExpiry = null as any
  user.otpAttempts = 0
  user.otpLastSent = null as any
  await user.save()

  // issue tokens
  const { accessToken, refreshToken } = generateTokens(user._id as any, user.email)

  // save refresh token to DB
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: getRefreshTokenExpiry(),
  })

  // set cookies
  setAuthCookies(res, accessToken, refreshToken)

  res.status(200).json({
    success: true,
    message: 'Email verified successfully.',
    data: { user },
  })
}

// ── Resend OTP ─────────────────────────────────────────────────────
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as ResendOTPInput

  const user = await User.findOne({ email })
  if (!user) {
    // no enumeration — always return success
    res.status(200).json({
      success: true,
      message: 'If that email exists, a new OTP has been sent.',
    })
    return
  }

  if (user.isVerified) {
    throw new AppError('Email already verified. Please login.', 400)
  }

  // check cooldown
  if (!canResendOTP(user.otpLastSent)) {
    const remaining = getResendCooldown(user.otpLastSent)
    throw new AppError(`Please wait ${remaining} seconds before resending.`, 429)
  }

  // generate new OTP
  const { otp, hashedOtp, otpExpiry } = await generateOTP()

  // reset attempts + save new OTP
  user.otp = hashedOtp
  user.otpExpiry = otpExpiry
  user.otpAttempts = 0
  user.otpLastSent = new Date()
  await user.save()

  // send email
  await sendOTPEmail(email, user.name, otp)

  res.status(200).json({
    success: true,
    message: 'New OTP sent. Please check your email.',
  })
}

// ── Login ──────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginInput

  // find user — select sensitive fields needed for auth
  const user = await User.findOne({ email }).select(
    '+passwordHash +isVerified +loginAttempts +lockUntil'
  )

  if (!user) {
    throw new AppError('Invalid credentials', 401)
  }

  // check account locked
  if (user.isLocked()) {
    const minutesLeft = Math.ceil(
      ((user.lockUntil as Date).getTime() - Date.now()) / 60000
    )
    throw new AppError(
      `Account locked. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`,
      423
    )
  }

  // compare password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

  if (!isPasswordValid) {
    // increment login attempts
    user.loginAttempts += 1

    // lock after 5 failed attempts
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 min
      await user.save()
      throw new AppError('Too many failed attempts. Account locked for 15 minutes.', 423)
    }

    await user.save()
    throw new AppError('Invalid credentials', 401)
  }

  // check verified
  if (!user.isVerified) {
    throw new AppError('Please verify your email before logging in.', 403)
  }

  // reset login attempts on success
  user.loginAttempts = 0
  user.lockUntil = null as any
  await user.save()

  // issue tokens
  const { accessToken, refreshToken } = generateTokens(user._id as any, user.email)

  // save refresh token to DB
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: getRefreshTokenExpiry(),
  })

  // set cookies
  setAuthCookies(res, accessToken, refreshToken)

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: { user },
  })
}

// ── Refresh token ──────────────────────────────────────────────────
export const refresh = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken

  if (!token) {
    throw new AppError('No refresh token provided', 401)
  }

  // find token in DB
  const storedToken = await RefreshToken.findOne({ token })

  if (!storedToken) {
    // token not in DB — possible reuse attack
    // find user from JWT to wipe all their tokens
    try {
      const jwt = await import('jsonwebtoken')
      const { env } = await import('../config/env')
      const decoded = jwt.default.verify(token, env.REFRESH_TOKEN_SECRET) as any

      // wipe all refresh tokens for this user
      await RefreshToken.deleteMany({ userId: decoded.userId })

      // find user to send security alert
      const user = await User.findById(decoded.userId)
      if (user) {
        await sendSecurityAlertEmail(user.email, user.name)
      }
    } catch {
      // token invalid — just clear cookies
    }

    clearAuthCookies(res)
    throw new AppError('Invalid refresh token. Please login again.', 401)
  }

  // check expiry
  if (storedToken.expiresAt < new Date()) {
    await storedToken.deleteOne()
    clearAuthCookies(res)
    throw new AppError('Refresh token expired. Please login again.', 401)
  }

  // find user
  const user = await User.findById(storedToken.userId)
  if (!user) {
    await storedToken.deleteOne()
    clearAuthCookies(res)
    throw new AppError('User not found', 401)
  }

  // ── Token rotation — delete old, create new ───────────────────
  await storedToken.deleteOne()

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    user._id as any,
    user.email
  )

  await RefreshToken.create({
    userId: user._id,
    token: newRefreshToken,
    expiresAt: getRefreshTokenExpiry(),
  })

  setAuthCookies(res, accessToken, newRefreshToken)

  res.status(200).json({
    success: true,
    message: 'Token refreshed.',
  })
}

// ── Get current user ───────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId)
  if (!user) {
    throw new AppError('User not found', 404)
  }

  res.status(200).json({
    success: true,
    data: { user },
  })
}

// ── Logout ─────────────────────────────────────────────────────────
export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken

  // delete refresh token from DB
  if (token) {
    await RefreshToken.deleteOne({ token })
  }

  clearAuthCookies(res)

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  })
}

// ── Logout all devices ─────────────────────────────────────────────
export const logoutAll = async (req: Request, res: Response): Promise<void> => {
  // delete ALL refresh tokens for this user
  await RefreshToken.deleteMany({ userId: req.user?.userId })

  clearAuthCookies(res)

  res.status(200).json({
    success: true,
    message: 'Logged out from all devices.',
  })
}

// ── Forgot password ────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as ForgotPasswordInput

  // always return 200 — no user enumeration
  const user = await User.findOne({ email })
  if (!user) {
    res.status(200).json({
      success: true,
      message: 'If that email exists, a reset code has been sent.',
    })
    return
  }

  // check cooldown
  if (!canResendOTP(user.otpLastSent)) {
    const remaining = getResendCooldown(user.otpLastSent)
    throw new AppError(`Please wait ${remaining} seconds before requesting again.`, 429)
  }

  // generate reset OTP
  const { otp, hashedOtp, otpExpiry } = await generateOTP()

  user.otp = hashedOtp
  user.otpExpiry = otpExpiry
  user.otpAttempts = 0
  user.otpLastSent = new Date()
  await user.save()

  await sendPasswordResetEmail(email, user.name, otp)

  res.status(200).json({
    success: true,
    message: 'If that email exists, a reset code has been sent.',
  })
}

// ── Reset password ─────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, newPassword } = req.body as ResetPasswordInput

  const user = await User.findOne({ email }).select(
    '+otp +otpExpiry +otpAttempts +passwordHash'
  )
  if (!user || !user.otp || !user.otpExpiry) {
    throw new AppError('Invalid or expired reset code', 400)
  }

  // check attempts
  if (user.otpAttempts >= 5) {
    throw new AppError('Too many attempts. Please request a new reset code.', 400)
  }

  // verify OTP
  const { valid, expired } = await verifyOTP(otp, user.otp, user.otpExpiry)

  if (expired || !valid) {
    user.otpAttempts += 1
    await user.save()
    throw new AppError('Invalid or expired reset code', 400)
  }

  // hash new password
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)

  // update password + clear OTP
  user.passwordHash = passwordHash
  user.otp = null as any
  user.otpExpiry = null as any
  user.otpAttempts = 0
  user.otpLastSent = null as any
  await user.save()

  // revoke ALL refresh tokens — force re-login everywhere
  await RefreshToken.deleteMany({ userId: user._id })

  clearAuthCookies(res)

  res.status(200).json({
    success: true,
    message: 'Password reset successful. Please login with your new password.',
  })
}

// ── Change password ────────────────────────────────────────────────
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body as ChangePasswordInput

  const user = await User.findById(req.user?.userId).select('+passwordHash')
  if (!user) {
    throw new AppError('User not found', 404)
  }

  // verify current password
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!isValid) {
    throw new AppError('Current password is incorrect', 400)
  }

  // hash new password
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
  user.passwordHash = passwordHash
  await user.save()

  res.status(200).json({
    success: true,
    message: 'Password changed successfully.',
  })
}