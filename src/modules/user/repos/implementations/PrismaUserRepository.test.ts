import { PrismaClient } from '@prisma/client'
import faker from 'faker'

import userFactory from '../../../../../tests/factories/userFactory'
import { UserRepository } from '../UserRepository'
import { PrismaUserRepository } from './PrismaUserRepository'

describe('PrismaUserRepository', () => {
  let prisma: PrismaClient
  let sut: UserRepository

  beforeAll(() => {
    prisma = new PrismaClient()
  })

  beforeEach(() => {
    sut = new PrismaUserRepository(prisma)
  })

  afterEach(async () => {
    await prisma.user.deleteMany({})
  })

  describe('loadByEmail', () => {
    it('should return null if user does not exists', async () => {
      const user = await sut.loadByEmail(faker.internet.email())
      expect(user).toBeNull()
    })

    it('should return user on success', async () => {
      const fakeUser = userFactory(1)
      const existingUser = await prisma.user.create({
        data: fakeUser
      })
      const user = await sut.loadByEmail(fakeUser.email)
      expect(user?.id).toEqual(existingUser.id)
    })
  })

  describe('setAccessToken', () => {
    it('should set users access token and return true', async () => {
      const token = faker.datatype.uuid()
      const user = await prisma.user.create({
        data: userFactory(1, { accessToken: null })
      })
      const result = await sut.setAccessToken(user.id, token)
      expect(result).toEqual(true)
      const afterOperationUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      expect(afterOperationUser?.accessToken).toEqual(token)
    })
  })
})
