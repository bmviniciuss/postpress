import { PrismaClient } from '@prisma/client'
import { Router } from 'express'

import { expressMiddlewareAdapter } from '../../adapters/expressMiddlewareAdapter'
import { expressAuthenticatedRouteAdapter } from '../../adapters/expressRouteAdapter'
import {
  makeGetPostsController,
  makePostSearchController,
  makeGetPostController,
  makeCreatePostController,
  makeUpdatePostController,
  makeDeletePostController
} from '../../factories/controllers/postsControllerFactories'
import { makeAuthMiddleware } from '../../factories/middlewares/makeAuthMiddleware'

export const makePostRoutes = (prisma: PrismaClient) => {
  const router = Router()

  router.get('/post',
    expressMiddlewareAdapter(makeAuthMiddleware(prisma)),
    expressAuthenticatedRouteAdapter(makeGetPostsController(prisma))
  )

  router.get('/post/search',
    expressMiddlewareAdapter(makeAuthMiddleware(prisma)),
    expressAuthenticatedRouteAdapter(makePostSearchController(prisma))
  )

  router.get('/post/:postId',
    expressMiddlewareAdapter(makeAuthMiddleware(prisma)),
    expressAuthenticatedRouteAdapter(makeGetPostController(prisma))
  )

  router.post('/post',
    expressMiddlewareAdapter(makeAuthMiddleware(prisma)),
    expressAuthenticatedRouteAdapter(makeCreatePostController(prisma))
  )

  router.put('/post/:postId',
    expressMiddlewareAdapter(makeAuthMiddleware(prisma)),
    expressAuthenticatedRouteAdapter(makeUpdatePostController(prisma))
  )

  router.delete('/post/:postId',
    expressMiddlewareAdapter(makeAuthMiddleware(prisma)),
    expressAuthenticatedRouteAdapter(makeDeletePostController(prisma))
  )
  return router
}
