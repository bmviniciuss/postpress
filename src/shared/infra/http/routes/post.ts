import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import Joi from 'joi'

import { JoiValidatorAdapter } from '../../../../infra/adapters/validation/JoiValidationAdapter'
import { PrismaPostRepository } from '../../../../modules/post/repos/implementations/PrismaPostRepository'
import { CreatePostController } from '../../../../modules/post/useCases/createPost/CreatePostController'
import { CreatePostUseCase } from '../../../../modules/post/useCases/createPost/CreatePostUseCase'
import { expressMiddlewareAdapter } from '../../adapters/expressMiddlewareAdapter'
import { expressAuthenticatedRouteAdapter } from '../../adapters/expressRouteAdapter'
import { makeJwtAdapter } from '../../factories/makeJwtAdapter'
import { makePrismaUserRepository } from '../../factories/repositories/prisma/makePrismaUserRepository'
import { AuthMidddleware } from '../middlewares/AuthMiddleware'

const makeCreatePostController = (prisma: PrismaClient) => {
  const createPostValidation = new JoiValidatorAdapter(Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
  }))

  const prismaPostRepository = new PrismaPostRepository(prisma)
  const createPostUseCase = new CreatePostUseCase(prismaPostRepository)

  return new CreatePostController(createPostValidation, createPostUseCase)
}

export const makePostRoutes = (prisma: PrismaClient) => {
  const router = Router()
  router.post('/post',
    expressMiddlewareAdapter(new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))),
    expressAuthenticatedRouteAdapter(makeCreatePostController(prisma))
  )
  return router
}
