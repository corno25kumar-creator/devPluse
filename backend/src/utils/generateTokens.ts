import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { env } from '../config/env'

// ── Token payload types ────────────────────────────────────────────
export interface AccessTokenPayload {
  userId: string
  email: string
}

export interface RefreshTokenPayload {
  userId: string
}

// ── Generate access token ──────────────────────────────────────────
export const generateAccessToken = (
  userId: Types.ObjectId,
  email: string
): string => {
  const payload: AccessTokenPayload = {
    userId: userId.toString(),
    email,
  }

  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  })
}

// ── Generate refresh token ─────────────────────────────────────────
export const generateRefreshToken = (userId: Types.ObjectId): string => {
  const payload: RefreshTokenPayload = {
    userId: userId.toString(),
  }

  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  })
}

// ── Generate both tokens at once ──────────────────────────────────
export const generateTokens = (
  userId: Types.ObjectId,
  email: string
): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken(userId, email)
  const refreshToken = generateRefreshToken(userId)

  return { accessToken, refreshToken }
}

// ── Get refresh token expiry date ─────────────────────────────────
// used when saving refresh token to DB
export const getRefreshTokenExpiry = (): Date => {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 7) // 7 days from now
  return expiry
}