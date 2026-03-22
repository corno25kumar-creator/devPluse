import crypto from 'crypto'
import bcrypt from 'bcryptjs'

// ── Constants ──────────────────────────────────────────────────────
const OTP_EXPIRY_MINUTES = 10
const BCRYPT_ROUNDS = 10 // lower than password (12) — OTPs are short-lived

// ── Generate OTP ───────────────────────────────────────────────────
// crypto.randomInt is cryptographically secure — never use Math.random()
export const generateOTP = async (): Promise<{
  otp: string        // plain OTP — sent to user via email
  hashedOtp: string  // bcrypt hash — stored in DB
  otpExpiry: Date    // expiry timestamp — stored in DB
}> => {
  // generate 6-digit number between 100000 and 999999
  const otp = crypto.randomInt(100000, 1000000).toString()

  // hash before storing — if DB leaked, raw OTPs not exposed
  const hashedOtp = await bcrypt.hash(otp, BCRYPT_ROUNDS)

  // expiry = now + 10 minutes
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  return { otp, hashedOtp, otpExpiry }
}

// ── Verify OTP ─────────────────────────────────────────────────────
export const verifyOTP = async (
  plainOtp: string,    // what user submitted
  hashedOtp: string,   // what is stored in DB
  otpExpiry: Date      // expiry stored in DB
): Promise<{ valid: boolean; expired: boolean }> => {

  // check expiry first — faster than bcrypt compare
  const isExpired = new Date() > otpExpiry
  if (isExpired) {
    return { valid: false, expired: true }
  }

  // bcrypt compare — slow by design, brute force resistant
  const isMatch = await bcrypt.compare(plainOtp, hashedOtp)

  return { valid: isMatch, expired: false }
}

// ── Check resend cooldown ──────────────────────────────────────────
export const canResendOTP = (otpLastSent: Date | null | undefined): boolean => {
  if (!otpLastSent) return true // never sent before — allow
  const secondsSinceLastSend = (Date.now() - otpLastSent.getTime()) / 1000
  return secondsSinceLastSend >= 60 // 60 second cooldown
}

// ── Get remaining cooldown seconds ────────────────────────────────
export const getResendCooldown = (otpLastSent: Date | null | undefined): number => {
  if (!otpLastSent) return 0
  const secondsSinceLastSend = (Date.now() - otpLastSent.getTime()) / 1000
  const remaining = 60 - secondsSinceLastSend
  return remaining > 0 ? Math.ceil(remaining) : 0
}