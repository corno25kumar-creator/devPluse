import { Resend } from 'resend'
import { env } from '../config/env'

// ── Resend client ──────────────────────────────────────────────────
const resend = new Resend(env.RESEND_API_KEY)

// ── Types ──────────────────────────────────────────────────────────
interface EmailResult {
  success: boolean
  error?: string
}

// ── Send OTP email ─────────────────────────────────────────────────
export const sendOTPEmail = async (
  toEmail: string,
  name: string,
  otp: string
): Promise<EmailResult> => {
  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: toEmail,
      subject: 'Your DevPulse verification code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Verify your email</h2>
          <p style="color: #444;">Hi ${name},</p>
          <p style="color: #444;">Your verification code is:</p>
          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #5c47e0;
            padding: 20px;
            background: #f4f2ff;
            border-radius: 8px;
            text-align: center;
            margin: 24px 0;
          ">
            ${otp}
          </div>
          <p style="color: #444;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #444;">If you did not request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">DevPulse — Developer Productivity Tracker</p>
        </div>
      `,
    })

    return { success: true }
  } catch (error: any) {
    console.error('❌ sendOTPEmail failed:', error?.message)
    return { success: false, error: error?.message }
  }
}

// ── Send password reset email ──────────────────────────────────────
export const sendPasswordResetEmail = async (
  toEmail: string,
  name: string,
  otp: string
): Promise<EmailResult> => {
  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: toEmail,
      subject: 'Reset your DevPulse password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Reset your password</h2>
          <p style="color: #444;">Hi ${name},</p>
          <p style="color: #444;">Your password reset code is:</p>
          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #e04747;
            padding: 20px;
            background: #fff4f4;
            border-radius: 8px;
            text-align: center;
            margin: 24px 0;
          ">
            ${otp}
          </div>
          <p style="color: #444;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #444;">If you did not request a password reset, please secure your account immediately.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">DevPulse — Developer Productivity Tracker</p>
        </div>
      `,
    })

    return { success: true }
  } catch (error: any) {
    console.error('❌ sendPasswordResetEmail failed:', error?.message)
    return { success: false, error: error?.message }
  }
}

// ── Send security alert email ──────────────────────────────────────
export const sendSecurityAlertEmail = async (
  toEmail: string,
  name: string
): Promise<EmailResult> => {
  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: toEmail,
      subject: '⚠️ Suspicious login detected on your DevPulse account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #e04747;">Security Alert</h2>
          <p style="color: #444;">Hi ${name},</p>
          <p style="color: #444;">
            We detected suspicious activity on your account. 
            Someone may have attempted to reuse an old session token.
          </p>
          <p style="color: #444;">
            As a precaution, <strong>all active sessions have been logged out</strong>.
          </p>
          <p style="color: #444;">Please log in again and change your password if you suspect unauthorized access.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">DevPulse — Developer Productivity Tracker</p>
        </div>
      `,
    })

    return { success: true }
  } catch (error: any) {
    console.error('❌ sendSecurityAlertEmail failed:', error?.message)
    return { success: false, error: error?.message }
  }
}