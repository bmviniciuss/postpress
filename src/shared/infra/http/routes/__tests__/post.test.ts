import { PrismaClient, User } from '@prisma/client'
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
})
