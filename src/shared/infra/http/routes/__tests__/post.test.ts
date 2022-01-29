import { PrismaClient, User } from '@prisma/client'
import faker from 'faker'
import { omit } from 'lodash'
import request from 'supertest'

import postFactory from '../../../../../../tests/factories/postFactory'
import userFactory from '../../../../../../tests/factories/userFactory'
import { buildAuthUser } from '../../../../../../tests/utils/buildAuthUser'
import { makeBearerToken } from '../../../../../../tests/utils/makeBearerToken'
import { makeExpressServer } from '../../config/makeExpressServer'

describe('Post Routes', () => {
  let prisma: PrismaClient
  let app: any
  let authUser: User

  beforeAll(async () => {
    prisma = new PrismaClient()
    authUser = await buildAuthUser(userFactory(1), prisma)
  })

  beforeEach(() => {
    app = makeExpressServer(prisma)
  })

  afterEach(async () => {
    await prisma.post.deleteMany({})
  })

  afterAll(async () => {
    await prisma.user.deleteMany({})
  })

  describe('POST /post', () => {
    it('should return 401 if authentication is not provided', async () => {
      const response = await request(app)
        .post('/post')
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token não encontrado",
        }
      `)
    })

    it('should return 401 if an invalid authentication is provided', async () => {
      const response = await request(app)
        .post('/post')
        .set('authorization', 'Bearer random')
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token expirado ou inválido",
        }
      `)
    })

    it('should return 400 with error message if validation fails', async () => {
      await (async () => {
        const noTitleResponse = await request(app)
          .post('/post')
          .set('authorization', makeBearerToken(authUser.accessToken!))
          .send({ content: 'any' })
        expect(noTitleResponse.statusCode).toEqual(400)
        expect(noTitleResponse.body).toMatchInlineSnapshot(`
          Object {
            "message": "\\"title\\" is required",
          }
        `)
      })()

      await (async () => {
        const noContentReponse = await request(app)
          .post('/post')
          .set('authorization', makeBearerToken(authUser.accessToken!))
          .send({ title: 'any' })
        expect(noContentReponse.statusCode).toEqual(400)
        expect(noContentReponse.body).toMatchInlineSnapshot(`
          Object {
            "message": "\\"content\\" is required",
          }
        `)
      })()
    })

    it('should 201 on success', async () => {
      const response = await request(app)
        .post('/post')
        .set('authorization', makeBearerToken(authUser.accessToken!))
        .send({ title: 'title', content: 'content' })
      expect(response.statusCode).toEqual(201)
      expect(response.body.title).toEqual('title')
      expect(response.body.title).toEqual('title')
      expect(response.body.content).toEqual('content')
      expect(response.body.userId).toEqual(authUser.id)
    })
  })

  describe('GET /post', () => {
    it('should return 401 if authentication is not provided', async () => {
      const response = await request(app)
        .get('/post')
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token não encontrado",
        }
      `)
    })

    it('should return 401 if an invalid authentication is provided', async () => {
      const response = await request(app)
        .get('/post')
        .set('authorization', 'Bearer random')
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token expirado ou inválido",
        }
      `)
    })

    it('should 200 on success', async () => {
      await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: {
              id: authUser.id
            }
          }
        }
      })
      await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: {
              id: authUser.id
            }
          }
        }
      })
      const response = await request(app)
        .get('/post')
        .set('authorization', makeBearerToken(authUser.accessToken!))
        .send({ title: 'title', content: 'content' })
      expect(response.statusCode).toEqual(200)
      expect(response.body.length).toEqual(2)
    })
  })

  describe('GET /post/:postId', () => {
    const makeUrl = (postId: string) => {
      return `/post/${postId}`
    }

    it('should return 401 if authentication is not provided', async () => {
      const response = await request(app)
        .get(makeUrl(faker.datatype.uuid()))
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token não encontrado",
        }
      `)
    })

    it('should return 401 if an invalid authentication is provided', async () => {
      const response = await request(app)
        .get(makeUrl(faker.datatype.uuid()))
        .set('authorization', 'Bearer random')
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token expirado ou inválido",
        }
      `)
    })

    it('should 200 on success', async () => {
      await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: {
              id: authUser.id
            }
          }
        }
      })
      const post = await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: {
              id: authUser.id
            }
          }
        }
      })
      const response = await request(app)
        .get(makeUrl(post.id))
        .set('authorization', makeBearerToken(authUser.accessToken!))
        .send({ title: 'title', content: 'content' })
      expect(response.statusCode).toEqual(200)
      expect(response.body.id).toEqual(post.id)
      expect(response.body.title).toEqual(post.title)
      expect(response.body.user.id).toEqual(authUser.id)
    })

    it('should return 404 if post does not exists', async () => {
      const response = await request(app)
        .get(makeUrl(faker.datatype.uuid()))
        .set('authorization', makeBearerToken(authUser.accessToken!))
        .send()
      expect(response.statusCode).toEqual(404)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Post não existe",
        }
      `)
    })
  })

  describe('PUT /post/:postId', () => {
    const makeUrl = (postId: string) => {
      return `/post/${postId}`
    }

    it('should return 401 if authentication is not provided', async () => {
      const response = await request(app)
        .put(makeUrl(faker.datatype.uuid()))
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token não encontrado",
        }
      `)
    })

    it('should return 401 if an invalid authentication is provided', async () => {
      const response = await request(app)
        .put(makeUrl(faker.datatype.uuid()))
        .set('authorization', 'Bearer random')
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token expirado ou inválido",
        }
      `)
    })

    it('should return 400 with error message if validation fails', async () => {
      const authRequest = () => request(app)
        .put(makeUrl(faker.datatype.uuid()))
        .set('authorization', makeBearerToken(authUser.accessToken!))

      await (async () => {
        const noTitleResponse = await authRequest()
          .send({ content: 'any' })
        expect(noTitleResponse.statusCode).toEqual(400)
        expect(noTitleResponse.body).toMatchInlineSnapshot(`
          Object {
            "message": "\\"title\\" is required",
          }
        `)
      })()

      await (async () => {
        const noContentReponse = await authRequest()
          .send({ title: 'any' })
        expect(noContentReponse.statusCode).toEqual(400)
        expect(noContentReponse.body).toMatchInlineSnapshot(`
          Object {
            "message": "\\"content\\" is required",
          }
        `)
      })()
    })

    it('should return 404 if post does not exists', async () => {
      const response = await request(app)
        .put(makeUrl(faker.datatype.uuid()))
        .set('authorization', makeBearerToken(authUser.accessToken!))
        .send({ title: 'any', content: 'any' })
      expect(response.statusCode).toEqual(404)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Post não existe",
        }
      `)
    })

    it('should 200 on success', async () => {
      const post = await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: { id: authUser.id }
          }
        }
      })

      const response = await request(app)
        .put(makeUrl(post.id))
        .set('authorization', makeBearerToken(authUser.accessToken!))
        .send({ title: 'title', content: 'content' })
      expect(response.statusCode).toEqual(200)
      expect(response.body.title).toEqual('title')
      expect(response.body.title).toEqual('title')
      expect(response.body.content).toEqual('content')
      expect(response.body.userId).toEqual(authUser.id)
    })
  })

  describe('GET /post/search?q=searchTerm', () => {
    const makeUrl = () => {
      return '/post/search'
    }

    it('should return 401 if authentication is not provided', async () => {
      const response = await request(app)
        .get(makeUrl())
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token não encontrado",
        }
      `)
    })

    it('should return 401 if an invalid authentication is provided', async () => {
      const response = await request(app)
        .get(makeUrl())
        .set('authorization', 'Bearer random')
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token expirado ou inválido",
        }
      `)
    })

    it('should 200 with filtered post', async () => {
      const post = await prisma.post.create({
        data: {
          title: 'Vamos que vamos',
          content: 'Foguete não tem ré',
          user: {
            connect: {
              id: authUser.id
            }
          }
        }
      })

      const response = await request(app)
        .get(makeUrl())
        .query({ q: 'Vamos que vamos' })
        .set('authorization', makeBearerToken(authUser.accessToken!))
      expect(response.statusCode).toEqual(200)
      expect(response.body[0].id).toEqual(post.id)
      expect(response.body[0].title).toEqual(post.title)
      expect(response.body[0].user.id).toEqual(authUser.id)
    })

    it('should 200 with all posts if no query params is sent', async () => {
      await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: {
              id: authUser.id
            }
          }
        }
      })

      await prisma.post.create({
        data: {
          ...omit(postFactory(1), 'userId'),
          user: {
            connect: {
              id: authUser.id
            }
          }
        }
      })

      const response = await request(app)
        .get(makeUrl())
        .query({ q: '' })
        .set('authorization', makeBearerToken(authUser.accessToken!))
      expect(response.statusCode).toEqual(200)
      expect(response.body.length).toEqual(2)
    })
  })
})
