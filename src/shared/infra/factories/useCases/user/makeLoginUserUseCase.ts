import { PrismaClient } from '@prisma/client'

import { LoginUserUseCase } from '../../../../../modules/user/useCases/login/LoginUserUseCase'
import { makeBcrytAdapter } from '../../makeBcryptAdapter'
import { makeJwtAdapter } from '../../makeJwtAdapter'
import { makePrismaUserRepository } from '../../repositories/prisma/prismaRepositoriesFactories'

export const makeLoginUserUseCase = (prisma: PrismaClient) => {
  const prismaUserRepository = makePrismaUserRepository(prisma)
  const bcryptAdapter = makeBcrytAdapter()
  const jwtAdapter = makeJwtAdapter()
  return new LoginUserUseCase(prismaUserRepository, bcryptAdapter, jwtAdapter)
}
