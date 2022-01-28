import { PrismaClient } from '@prisma/client'
import { omit } from 'lodash'

import postFactory from '../../../../../tests/factories/postFactory'
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

  describe('getAll', () => {
    it('should return all posts with user', async () => {
      const user = await prisma.user.create({
        data: userFactory(1)
      })
      await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: {
              id: user.id
            }
          }
        }
      })
      await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: {
              id: user.id
            }
          }
        }
      })
      const posts = await sut.getAll()
      expect(posts.length).toEqual(2)
      posts.forEach((post) => {
        expect(post.user.id).toEqual(user.id)
      })
    })
  })

  describe('loadById', () => {
    it('should return post with user', async () => {
      const user = await prisma.user.create({
        data: userFactory(1)
      })
      const createdPost = await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: {
              id: user.id
            }
          }
        }
      })
      const post = await sut.loadById(createdPost.id)
      expect(post!.id).toBeDefined()
      expect(post!.user.id).toEqual(user.id)
    })
  })
})
