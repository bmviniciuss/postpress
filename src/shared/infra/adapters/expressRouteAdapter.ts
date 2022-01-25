import { RequestHandler } from 'express'

import { Controller } from '../http/Controller'

export type ExpressRouteAdapter = (controller: Controller) => RequestHandler

export const expressRouteAdapter: ExpressRouteAdapter = (controller: Controller) => {
  return async (req, res) => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {})
    }
    const { statusCode, data } = await controller.handle(request)

    if (statusCode >= 200 && statusCode <= 299) {
      return res.status(statusCode).json(data)
    }

    return res.status(statusCode).json({
      message: data.message
    })
  }
}
