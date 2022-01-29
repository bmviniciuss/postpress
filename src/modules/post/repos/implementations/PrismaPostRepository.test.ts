import { PrismaClient } from '@prisma/client'
import faker from 'faker'
import { omit } from 'lodash'

import postFactory from '../../../../../tests/factories/postFactory'
import userFactory from '../../../../../tests/factories/userFactory'
import { PostRepository, PostRepositoryCreateDTO, PostRepositoryUpdateDTO } from '../PostRepository'
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

  describe('update', () => {
    it('should return updated post', async () => {
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

      const payload: PostRepositoryUpdateDTO = {
        title: faker.random.words(),
        content: faker.random.words()
      }
      const updatedPost = await sut.update(createdPost.id, payload)
      expect(updatedPost!.id).toBeDefined()
      expect(updatedPost.title).toEqual(payload.title)
      expect(updatedPost.content).toEqual(payload.content)
      expect(updatedPost!.user.id).toEqual(user.id)
    })
  })

  describe('findBySearch', () => {
    it('should search for post by title or content when searchTerm is provided', async () => {
      const user = await prisma.user.create({
        data: userFactory(1)
      })
      const createdPost = await prisma.post.create({
        data: {
          title: 'super title',
          content: 'my post content',
          user: {
            connect: {
              id: user.id
            }
          }
        },
        include: { user: true }
      })

      await (async () => {
        const posts = await sut.findBySearch({
          searchTerm: 'title'
        })
        expect(posts).toEqual([createdPost])
      })()

      await (async () => {
        const posts = await sut.findBySearch({
          searchTerm: 'super ti'
        })
        expect(posts).toEqual([createdPost])
      })()

      await (async () => {
        const posts = await sut.findBySearch({
          searchTerm: 'post'
        })
        expect(posts).toEqual([createdPost])
      })()

      await (async () => {
        const posts = await sut.findBySearch({
          searchTerm: 'post content'
        })
        expect(posts).toEqual([createdPost])
      })()
    })

    it('should return all posts if no searchTerm is provided', async () => {
      const user = await prisma.user.create({
        data: userFactory(1)
      })
      await prisma.post.create({
        data: {
          title: 'super title',
          content: 'my post content',
          user: {
            connect: {
              id: user.id
            }
          }
        },
        include: { user: true }
      })

      await prisma.post.create({
        data: {
          title: 'super title',
          content: 'my post content',
          user: {
            connect: {
              id: user.id
            }
          }
        },
        include: { user: true }
      })

      const posts = await sut.findBySearch({})
      expect(posts.length).toEqual(2)
    })
  })

  describe('deletePostById', () => {
    it('should return deleted post on success', async () => {
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

      const updatedPost = await sut.deletePostById(createdPost.id)
      expect(updatedPost!.id).toBeDefined()
      expect(updatedPost!.user.id).toEqual(user.id)
    })
  })
})
