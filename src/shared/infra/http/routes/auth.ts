import { PrismaClient } from '@prisma/client'
import { FastifyPluginAsync } from 'fastify'
import Joi from 'joi'

import { BcryptAdapter } from '../../../../infra/adapters/cryptography/BcryptAdapter'
import { JwtAdapter } from '../../../../infra/adapters/cryptography/JwtAdapter'
import { JoiValidatorAdapter } from '../../../../infra/adapters/validation/JoiValidationAdapter'
import { PrismaUserRepository } from '../../../../modules/user/repos/implementations/PrismaUserRepository'
import { LoginUserController } from '../../../../modules/user/useCases/login/LoginUserController'
import { LoginUserUseCase } from '../../../../modules/user/useCases/login/LoginUserUseCase'

export function makeAuthRoutes (prisma: PrismaClient): FastifyPluginAsync {
  return async (fastify) => {
    fastify.post('/login', async (request, reply) => {
      const data = request.body
      console.log('TA CAINDO AQUI')

      const userRepository = new PrismaUserRepository(prisma)
      const bcryptHasher = new BcryptAdapter()
      const jwt = new JwtAdapter('SUPER_SECRET')
      const useCase = new LoginUserUseCase(
        userRepository,
        bcryptHasher,
        jwt
      )
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      })
      const validation = new JoiValidatorAdapter(schema)
      const controller = new LoginUserController(validation, useCase)
      const httpResponse = await controller.handle(data)

      if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        return reply.code(httpResponse.statusCode).send(httpResponse.data)
      } else {
        return reply.code(httpResponse.statusCode).send({
          message: httpResponse.data.message
        })
      }
    })
  }
}
