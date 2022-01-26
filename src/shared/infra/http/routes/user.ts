import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import Joi from 'joi'

import { JoiValidatorAdapter } from '../../../../infra/adapters/validation/JoiValidationAdapter'
import { RegisterUserController } from '../../../../modules/user/useCases/register/RegisterUserController'
import { expressRouteAdapter } from '../../adapters/expressRouteAdapter'
import { makeLoginUserUseCase } from '../../factories/useCases/user/makeLoginUserUseCase'
import { makeRegisterUserUseCase } from '../../factories/useCases/user/makeRegisterUserUseCase'

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

export const makeUsersRouter = (prisma: PrismaClient) => {
  const router = Router()
  router.post('/user', expressRouteAdapter(makeRegisterUserController(prisma)))
  return router
}
