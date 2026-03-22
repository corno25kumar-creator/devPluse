import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env'

// ── Custom app error class ─────────────────────────────────────────
export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true // expected error — not a bug
    Error.captureStackTrace(this, this.constructor)
  }
}

// ── Central error handler ──────────────────────────────────────────
// must have 4 params for Express to treat it as error handler
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // ── AppError — known, expected errors ────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
    return
  }

  // ── Zod validation error ──────────────────────────────────────────
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
    return
  }

  // ── Mongoose duplicate key error ──────────────────────────────────
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0]
    res.status(409).json({
      success: false,
      message: `${field} already exists`,
    })
    return
  }

  // ── Mongoose validation error ─────────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }))
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
    return
  }

  // ── Mongoose cast error — invalid ObjectId ────────────────────────
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    })
    return
  }

  // ── JWT errors ────────────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired',
      code: 'TOKEN_EXPIRED',
    })
    return
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    })
    return
  }

  // ── Unknown error — never expose details in production ────────────
  console.error('❌ Unhandled error:', err)

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === 'development'
        ? err.message  // show real error in dev
        : 'Something went wrong. Please try again.', // hide in prod
  })
}

export default errorHandler