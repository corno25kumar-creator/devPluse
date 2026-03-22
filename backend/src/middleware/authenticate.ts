import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AccessTokenPayload } from '../utils/generateTokens'
import { Types } from 'mongoose'

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // ── Read token from httpOnly cookie ──────────────────────────
    const token = req.cookies?.accessToken

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
      return
    }

    // ── Verify signature + expiry ─────────────────────────────────
    const decoded = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    ) as AccessTokenPayload

    // ── Attach user to request ────────────────────────────────────
    req.user = {
      userId: new Types.ObjectId(decoded.userId),
      email: decoded.email,
    }

    next()
  } catch (error: any) {
    // ── Handle specific JWT errors ────────────────────────────────
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired.',
        code: 'TOKEN_EXPIRED', // frontend Axios interceptor checks this
      })
      return
    }

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      })
      return
    }

    // ── Unknown error ─────────────────────────────────────────────
    res.status(401).json({
      success: false,
      message: 'Authentication failed.',
    })
  }
}

export default authenticate