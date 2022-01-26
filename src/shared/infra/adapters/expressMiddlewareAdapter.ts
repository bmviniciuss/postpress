import { NextFunction, Request, Response } from 'express'

import { Middleware } from '../http/Middleware'

export const expressMiddlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers?.authorization ?? null
    }
    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.data)
      next()
    } else {
      return res.status(httpResponse.statusCode).json({
        message: httpResponse.data.message
      })
    }
  }
}
