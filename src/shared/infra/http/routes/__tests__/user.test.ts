import { PrismaClient } from '@prisma/client'
import faker from 'faker'
import request from 'supertest'

import userFactory from '../../../../../../tests/factories/userFactory'
import { buildAuthUser } from '../../../../../../tests/utils/buildAuthUser'
import { makeBearerToken } from '../../../../../../tests/utils/makeBearerToken'
import { UserMapper } from '../../../../../modules/user/models/mappers/UserMapper'
import { makeExpressServer } from '../../config/makeExpressServer'

describe('User Routes', () => {
  let prisma: PrismaClient
  let app: any

  beforeAll(() => {
    prisma = new PrismaClient()
  })

  beforeEach(() => {
    app = makeExpressServer(prisma)
  })

  afterEach(async () => {
    await prisma.user.deleteMany({})
  })

  describe('POST /user', () => {
    it('should return 201 and token on success', async () => {
      const response = await request(app)
        .post('/user')
        .send({
          displayName: faker.name.findName(),
          email: faker.internet.email(),
          password: faker.internet.password(7),
          image: faker.image.imageUrl()
        })
      expect(response.statusCode).toEqual(201)
      expect(response.body.token).toBeDefined()
    })

    it('should return 400 if displayName validation fails', async () => {
      const existingUser = await prisma.user.create({ data: userFactory(1) })
      const response = await request(app)
        .post('/user')
        .send({
          displayName: '1234567',
          email: existingUser.email,
          password: faker.internet.password(7),
          image: faker.image.imageUrl()
        })
      expect(response.statusCode).toEqual(400)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "\\"displayName\\" length must be at least 8 characters long",
        }
        `)
    })

    it('should return 400 if email validation fails', async () => {
      await (async () => {
        const r = await request(app)
          .post('/user')
          .send({
            displayName: faker.name.findName(),
            email: faker.name.findName(),
            password: faker.internet.password(7),
            image: faker.image.imageUrl()
          })
        expect(r.statusCode).toEqual(400)
        expect(r.body).toMatchInlineSnapshot(`
          Object {
            "message": "\\"email\\" must be a valid email",
          }
        `)
      })()

      await (async () => {
        const r = await request(app)
          .post('/user')
          .send({
            displayName: faker.name.findName(),
            email: '@gmail.com',
            password: faker.internet.password(7),
            image: faker.image.imageUrl()
          })
        expect(r.statusCode).toEqual(400)
        expect(r.body).toMatchInlineSnapshot(`
          Object {
            "message": "\\"email\\" must be a valid email",
          }
        `)
      })()

      await (async () => {
        const r = await request(app)
          .post('/user')
          .send({
            displayName: faker.name.findName(),
            password: faker.internet.password(7),
            image: faker.image.imageUrl()
          })
        expect(r.statusCode).toEqual(400)
        expect(r.body).toMatchInlineSnapshot(`
          Object {
            "message": "\\"email\\" is required",
          }
        `)
      })()
    })

    it('should return 400 if password validation fails', async () => {
      await (async () => {
        const r = await request(app)
          .post('/user')
          .send({
            displayName: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(5),
            image: faker.image.imageUrl()
          })
        expect(r.statusCode).toEqual(400)
        expect(r.body).toMatchInlineSnapshot(`
          Object {
            "message": "\\"password\\" length must be at least 6 characters long",
          }
        `)
      })()

      await (async () => {
        const r = await request(app)
          .post('/user')
          .send({
            displayName: faker.name.findName(),
            email: faker.internet.email(),
            image: faker.image.imageUrl()
          })
        expect(r.statusCode).toEqual(400)
        expect(r.body).toMatchInlineSnapshot(`
          Object {
            "message": "\\"password\\" is required",
          }
        `)
      })()
    })

    it('should return 409 if a user with email already exists', async () => {
      const existingUser = await prisma.user.create({ data: userFactory(1) })
      const response = await request(app)
        .post('/user')
        .send({
          displayName: faker.name.findName(),
          email: existingUser.email,
          password: faker.internet.password(7),
          image: faker.image.imageUrl()
        })
      expect(response.statusCode).toEqual(409)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Usu??rio j?? existe",
        }
      `)
    })
  })

  describe('GET /user', () => {
    it('should return 401 if authentication is not provided', async () => {
      const response = await request(app)
        .get('/user')
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token n??o encontrado",
        }
      `)
    })

    it('should return 401 if an invalid authentication is provided', async () => {
      const response = await request(app)
        .get('/user')
        .set('authorization', 'Bearer random')
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token expirado ou inv??lido",
        }
      `)
    })

    it('should return 200 with users on success', async () => {
      const user = await buildAuthUser(userFactory(1), prisma)
      const secondUser = await prisma.user.create({
        data: userFactory(1)
      })
      const response = await request(app)
        .get('/user')
        .set('authorization', `Bearer ${user.accessToken}`)
        .send()
      expect(response.statusCode).toEqual(200)
      expect(response.body.length).toEqual(2)
      expect(response.body).toEqual(UserMapper.toPresentations([user, secondUser]))
    })
  })

  describe('GET /user/:userId', () => {
    const makeUrl = (userId: string) => {
      return `/user/${userId}`
    }

    it('should return 401 if authentication is not provided', async () => {
      const response = await request(app)
        .get(makeUrl(faker.datatype.uuid()))
        .send()
      expect(response.statusCode).toEqual(401)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token n??o encontrado",
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
          "message": "Token expirado ou inv??lido",
        }
      `)
    })

    it('should return 404 if user does not exists', async () => {
      const user = await buildAuthUser(userFactory(1), prisma)
      const response = await request(app)
        .get(makeUrl(faker.datatype.uuid()))
        .set('authorization', `Bearer ${user.accessToken}`)
        .send()
      expect(response.statusCode).toEqual(404)
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "message": "Usu??rio n??o existe",
        }
      `)
    })

    it('should return 200 with user', async () => {
      const user = await buildAuthUser(userFactory(1), prisma)
      const response = await request(app)
        .get(makeUrl(user.id))
        .set('authorization', makeBearerToken(user.accessToken!))
        .send()
      expect(response.statusCode).toEqual(200)
      expect(response.body.id).toEqual(user.id)
      expect(response.body.email).toEqual(user.email)
    })
  })

  describe('DELETE /user/me', () => {
    it('should return 401 if authentication is not provided or is invalid', async () => {
      const noAuthRequest = await request(app)
        .delete('/user/me')
        .send()
      expect(noAuthRequest.statusCode).toEqual(401)
      expect(noAuthRequest.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token n??o encontrado",
        }
      `)

      const invalidRequest = await request(app)
        .delete('/user/me')
        .set('authorization', 'Bearer random')
        .send()
      expect(invalidRequest.statusCode).toEqual(401)
      expect(invalidRequest.body).toMatchInlineSnapshot(`
        Object {
          "message": "Token expirado ou inv??lido",
        }
      `)
    })

    it('should return 204 on success', async () => {
      const user = await buildAuthUser(userFactory(1), prisma)
      const response = await request(app)
        .delete('/user/me')
        .set('authorization', makeBearerToken(user.accessToken!))
        .send()
      expect(response.statusCode).toEqual(204)
      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      expect(deletedUser).toBeNull()
    })
  })
})
