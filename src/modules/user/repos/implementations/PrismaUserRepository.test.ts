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

  describe('register', () => {
    it('should return a user on sucess', async () => {
      const user = userFactory(1)
      const created = await sut.register({
        displayName: user.displayName,
        email: user.email,
        password: user.password,
        image: user.image
      })
      expect(created).toBeDefined()
      expect(created.email).toEqual(user.email)
    })
  })

  describe('listAll', () => {
    it('should return all users', async () => {
      const users = await prisma.user.create({ data: userFactory(1) })
      const result = await sut.listAll()
      expect(result).toBeDefined()
      expect(result.length).toEqual(1)
      expect(result).toEqual([users])
    })
  })

  describe('loadUserFromTokenAndId', () => {
    it('should return user with id and token', async () => {
      const token = faker.datatype.uuid()
      const user = await prisma.user.create({
        data: userFactory(1, { accessToken: token })
      })
      const result = await sut.loadUserFromTokenAndId(user.id, token)
      expect(result).toEqual(user)
    })
  })

  describe('loadById', () => {
    it('should return user', async () => {
      const token = faker.datatype.uuid()
      const user = await prisma.user.create({
        data: userFactory(1, { accessToken: token })
      })
      const result = await sut.loadById(user.id)
      expect(result).toEqual(user)
    })

    it('should return null if user does not exists', async () => {
      const result = await sut.loadById(faker.datatype.uuid())
      expect(result).toEqual(null)
    })
  })

  describe('deleteUserById', () => {
    it('should return deleted user', async () => {
      const user = await prisma.user.create({
        data: userFactory(1)
      })
      const result = await sut.deleteUserById(user.id)
      expect(result).toEqual(user)
    })
  })
})
