import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import Joi from 'joi'

import { JoiValidatorAdapter } from '../../../../infra/adapters/validation/JoiValidationAdapter'
import { PrismaPostRepository } from '../../../../modules/post/repos/implementations/PrismaPostRepository'
import { CreatePostController } from '../../../../modules/post/useCases/createPost/CreatePostController'
import { CreatePostUseCase } from '../../../../modules/post/useCases/createPost/CreatePostUseCase'
import { LoginUserController } from '../../../../modules/user/useCases/login/LoginUserController'
import { expressMiddlewareAdapter } from '../../adapters/expressMiddlewareAdapter'
import { expressAuthenticatedRouteAdapter } from '../../adapters/expressRouteAdapter'
import { makeJwtAdapter } from '../../factories/makeJwtAdapter'
import { makePrismaUserRepository } from '../../factories/repositories/prisma/makePrismaUserRepository'
import { makeLoginUserUseCase } from '../../factories/useCases/user/makeLoginUserUseCase'
import { Controller } from '../Controller'
import { AuthMidddleware } from '../middlewares/AuthMiddleware'

export const makeLoginUserController = (prisma: PrismaClient): Controller => {
  const loginUserUseCase = makeLoginUserUseCase(prisma)
  const loginUserValidator = new JoiValidatorAdapter(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }))
  return new LoginUserController(loginUserValidator, loginUserUseCase)
}

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
