import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import Joi from 'joi'

import { JoiValidatorAdapter } from '../../../../infra/adapters/validation/JoiValidationAdapter'
import { GetUserController } from '../../../../modules/user/useCases/getUser/GetUserController'
import { GetUserUseCase } from '../../../../modules/user/useCases/getUser/GetUserUseCase'
import { GetUsersController } from '../../../../modules/user/useCases/getUsers/GetUsersController'
import { GetUsersUseCase } from '../../../../modules/user/useCases/getUsers/GetUsersUseCase'
import { RegisterUserController } from '../../../../modules/user/useCases/register/RegisterUserController'
import { RemoveUserController } from '../../../../modules/user/useCases/removeUser/RemoveUserController'
import { RemoveUserUseCase } from '../../../../modules/user/useCases/removeUser/RemoveUserUseCase'
import { expressMiddlewareAdapter } from '../../adapters/expressMiddlewareAdapter'
import { expressAuthenticatedRouteAdapter, expressRouteAdapter } from '../../adapters/expressRouteAdapter'
import { makeJwtAdapter } from '../../factories/makeJwtAdapter'
import { makePrismaUserRepository } from '../../factories/repositories/prisma/makePrismaUserRepository'
import { makeLoginUserUseCase } from '../../factories/useCases/user/makeLoginUserUseCase'
import { makeRegisterUserUseCase } from '../../factories/useCases/user/makeRegisterUserUseCase'
import { AuthMidddleware } from '../middlewares/AuthMiddleware'

export const makeRegisterUserController = (prisma: PrismaClient) => {
  const registerUserValidator = new JoiValidatorAdapter(Joi.object({
    displayName: Joi.string().min(8),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    image: Joi.string()
  }))

  const registerUserUseCase = makeRegisterUserUseCase(prisma)

  const loginUserUsecase = makeLoginUserUseCase(prisma)
  return new RegisterUserController(registerUserValidator, registerUserUseCase, loginUserUsecase)
}

export const makeGetUsersController = (prisma: PrismaClient) => {
  const userRepository = makePrismaUserRepository(prisma)
  const getUsersUseCase = new GetUsersUseCase(userRepository)
  return new GetUsersController(getUsersUseCase)
}

export const makeGetUserController = (prisma: PrismaClient) => {
  const userRepository = makePrismaUserRepository(prisma)
  const getUserUseCase = new GetUserUseCase(userRepository)
  return new GetUserController(getUserUseCase)
}

export const makeRemoveUserController = (prisma: PrismaClient) => {
  const userRepository = makePrismaUserRepository(prisma)
  const removeUserUseCase = new RemoveUserUseCase(userRepository)
  return new RemoveUserController(removeUserUseCase)
}

export const makeUsersRouter = (prisma: PrismaClient) => {
  const router = Router()
  router.post('/user', expressRouteAdapter(makeRegisterUserController(prisma)))

  router.get('/user',
    expressMiddlewareAdapter(new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))),
    expressAuthenticatedRouteAdapter(makeGetUsersController(prisma))
  )
  router.get('/user/:userId',
    expressMiddlewareAdapter(new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))),
    expressAuthenticatedRouteAdapter(makeGetUserController(prisma))
  )

  router.delete('/user/me',
    expressMiddlewareAdapter(new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))),
    expressAuthenticatedRouteAdapter(makeRemoveUserController(prisma))
  )
  return router
}
