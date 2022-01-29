import { PrismaClient } from '@prisma/client'

import { AuthMidddleware } from '../../http/middlewares/AuthMiddleware'
import { makeJwtAdapter } from '../makeJwtAdapter'
import { makePrismaUserRepository } from '../repositories/prisma/prismaRepositoriesFactories'

export const makeAuthMiddleware = (prisma: PrismaClient) => {
  return new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))
}
