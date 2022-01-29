import { PrismaClient } from '@prisma/client'
import { Router } from 'express'

import { expressMiddlewareAdapter } from '../../adapters/expressMiddlewareAdapter'
import { expressAuthenticatedRouteAdapter, expressRouteAdapter } from '../../adapters/expressRouteAdapter'
import {
  makeRegisterUserController,
  makeGetUsersController,
  makeGetUserController,
  makeRemoveUserController
} from '../../factories/controllers/userControllersFactories'
import { makeAuthMiddleware } from '../../factories/middlewares/makeAuthMiddleware'

export const makeUsersRouter = (prisma: PrismaClient) => {
  const router = Router()

  router.get('/user',
    expressMiddlewareAdapter(makeAuthMiddleware(prisma)),
    expressAuthenticatedRouteAdapter(makeGetUsersController(prisma))
  )
  router.get('/user/:userId',
    expressMiddlewareAdapter(makeAuthMiddleware(prisma)),
    expressAuthenticatedRouteAdapter(makeGetUserController(prisma))
  )

  router.post('/user', expressRouteAdapter(makeRegisterUserController(prisma)))

  router.delete('/user/me',
    expressMiddlewareAdapter(makeAuthMiddleware(prisma)),
    expressAuthenticatedRouteAdapter(makeRemoveUserController(prisma))
  )
  return router
}
