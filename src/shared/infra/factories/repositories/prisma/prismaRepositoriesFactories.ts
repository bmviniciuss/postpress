import { PrismaClient } from '@prisma/client'

import { PrismaUserRepository } from '../../../../../modules/user/repos/implementations/PrismaUserRepository'

export const makePrismaUserRepository = (prisma: PrismaClient) => {
  return new PrismaUserRepository(prisma)
}
