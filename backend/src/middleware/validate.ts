import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      // ── Parse and replace req.body with validated data ──────────
      // this strips unknown fields (.strict()) and applies defaults
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // ── Format Zod errors into clean array ────────────────────
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        })
        return
      }

      // ── Unknown error ─────────────────────────────────────────
      res.status(400).json({
        success: false,
        message: 'Invalid request body',
      })
    }
  }

export default validate