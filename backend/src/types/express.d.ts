/*
Jab tum middleware me req.user add karte ho, tab TypeScript ko batane ke 
liye ye code likhte ho ki Request object me user field exist karti hai.
 */

import { Types } from 'mongoose'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: Types.ObjectId
        email: string
      }
    }
  }
}

export {}