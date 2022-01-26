/* eslint-disable no-unused-vars */
import { User } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: User
    }
  }
}
