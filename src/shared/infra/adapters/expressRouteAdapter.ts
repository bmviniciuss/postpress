import { Request, RequestHandler, Response } from 'express'

import { AppErrors } from '../../errors/AppErrors'
import { Controller } from '../http/Controller'
import { HttpAuthenticatedRequest } from '../http/http'

export type ExpressRouteAdapter = (controller: Controller) => RequestHandler

export const expressRouteAdapter: ExpressRouteAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const { statusCode, data } = await controller.handle(req.body)

    if (statusCode >= 200 && statusCode <= 299) {
      return res.status(statusCode).json(data)
    }

    return res.status(statusCode).json({
      message: data.message
    })
  }
}

export const expressAuthenticatedRouteAdapter: ExpressRouteAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    if (!req.authenticatedUser) {
      return res.status(401).send({
        message: new AppErrors.TokenNotFoundError().message
      })
    }

    const body: HttpAuthenticatedRequest = {
      body: req.body,
      authenticatedUser: req.authenticatedUser
    }

    const { statusCode, data } = await controller.handle(body)

    if (statusCode >= 200 && statusCode <= 299) {
      return res.status(statusCode).json(data)
    }

    return res.status(statusCode).json({
      message: data.message
    })
  }
}
