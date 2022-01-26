import { PrismaClient, User } from '@prisma/client'

import { makeJwtAdapter } from '../../src/shared/infra/factories/makeJwtAdapter'

export async function buildAuthUser (user: User, prisma: PrismaClient) {
  const userDb = await prisma.user.create({ data: user })
  const jwt = await makeJwtAdapter().encrypt(userDb.id)
  return prisma.user.update({
    where: { id: userDb.id },
    data: { accessToken: jwt }
  })
}
