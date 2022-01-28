import { PrismaClient } from '@prisma/client'

import userFactory from '../../../../../tests/factories/userFactory'
import { PostRepository, PostRepositoryCreateDTO } from '../PostRepository'
import { PrismaPostRepository } from './PrismaPostRepository'

describe('PrismaPostRepository', () => {
  let prisma: PrismaClient
  let sut: PostRepository

  beforeAll(() => {
    prisma = new PrismaClient()
  })

  beforeEach(() => {
    sut = new PrismaPostRepository(prisma)
  })

  afterEach(async () => {
    await prisma.post.deleteMany({})
    await prisma.user.deleteMany({})
  })

  describe('create', () => {
    it('should create a post and return with user', async () => {
      const user = await prisma.user.create({
        data: userFactory(1)
      })
      const payload: PostRepositoryCreateDTO = {
        title: 'title',
        content: 'content',
        userId: user.id
      }
      const post = await sut.create(payload)
      expect(post.id).toBeDefined()
      expect(post.user.id).toEqual(user.id)
    })
  })
})
