import { PrismaClient } from '@prisma/client'

import { RegisterUserUseCase } from '../../../../../modules/user/useCases/register/RegisterUserUseCase'
import { makeBcrytAdapter } from '../../makeBcryptAdapter'
import { makePrismaUserRepository } from '../../repositories/prisma/prismaRepositoriesFactories'

export const makeRegisterUserUseCase = (prisma: PrismaClient) => {
  const prismaUserRepository = makePrismaUserRepository(prisma)
  const bcryptAdapter = makeBcrytAdapter()
  return new RegisterUserUseCase(prismaUserRepository, bcryptAdapter)
}
