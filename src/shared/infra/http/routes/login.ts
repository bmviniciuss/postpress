import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import Joi from 'joi'

import { JoiValidatorAdapter } from '../../../../infra/adapters/validation/JoiValidationAdapter'
import { LoginUserController } from '../../../../modules/user/useCases/login/LoginUserController'
import { expressRouteAdapter } from '../../adapters/expressRouteAdapter'
import { makeLoginUserUseCase } from '../../factories/useCases/user/makeLoginUserUseCase'
import { Controller } from '../Controller'

export const makeLoginUserController = (prisma: PrismaClient): Controller => {
  const loginUserUseCase = makeLoginUserUseCase(prisma)
  const loginUserValidator = new JoiValidatorAdapter(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }))
  return new LoginUserController(loginUserValidator, loginUserUseCase)
}

export const makeLoginRouter = (prisma: PrismaClient) => {
  const router = Router()
  router.post('/login', expressRouteAdapter(makeLoginUserController(prisma)))
  return router
}
