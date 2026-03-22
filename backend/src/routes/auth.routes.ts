import { Router } from 'express'
import {
  register,
  verifyOTPHandler,
  resendOTP,
  login,
  refresh,
  getMe,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/auth.controller'
import validate from '../middleware/validate'
import authenticate from '../middleware/authenticate'
import {
  registerLimiter,
  loginLimiter,
  otpLimiter,
  resendOtpLimiter,
  forgotPasswordLimiter,
  refreshLimiter,
} from '../middleware/rateLimiter'
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../schemas/auth.schema'

const router = Router()

// ── Public routes ──────────────────────────────────────────────────
router.post('/register',
  registerLimiter,
  validate(registerSchema),
  register
)

router.post('/verify-otp',
  otpLimiter,
  validate(verifyOTPSchema),
  verifyOTPHandler
)

router.post('/resend-otp',
  resendOtpLimiter,
  validate(resendOTPSchema),
  resendOTP
)

router.post('/login',
  loginLimiter,
  validate(loginSchema),
  login
)

router.post('/refresh',
  refreshLimiter,
  refresh
)

router.post('/forgot-password',
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
)

router.post('/reset-password',
  validate(resetPasswordSchema),
  resetPassword
)

// ── Protected routes — require valid accessToken cookie ────────────
router.get('/me',
  authenticate,
  getMe
)

router.delete('/logout',
  authenticate,
  logout
)

router.delete('/logout-all',
  authenticate,
  logoutAll
)

router.patch('/change-password',
  authenticate,
  validate(changePasswordSchema),
  changePassword
)

export default router