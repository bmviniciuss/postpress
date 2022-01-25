import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import Joi from 'joi'

import { JWT_SECRET } from '../../../../config/env'
import { BcryptAdapter } from '../../../../infra/adapters/cryptography/BcryptAdapter'
import { JwtAdapter } from '../../../../infra/adapters/cryptography/JwtAdapter'
import { JoiValidatorAdapter } from '../../../../infra/adapters/validation/JoiValidationAdapter'
import { PrismaUserRepository } from '../../../../modules/user/repos/implementations/PrismaUserRepository'
import { LoginUserController } from '../../../../modules/user/useCases/login/LoginUserController'
import { LoginUserUseCase } from '../../../../modules/user/useCases/login/LoginUserUseCase'
import { expressRouteAdapter } from '../../adapters/expressRouteAdapter'

export const makeLoginUserController = (prisma: PrismaClient) => {
  const prismaUserRepository = new PrismaUserRepository(prisma)
  const bcryptAdapter = new BcryptAdapter()
  const jwtAdapter = new JwtAdapter(JWT_SECRET)
  const loginUserUseCase = new LoginUserUseCase(prismaUserRepository, bcryptAdapter, jwtAdapter)
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
