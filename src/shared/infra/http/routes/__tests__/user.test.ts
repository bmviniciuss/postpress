import { PrismaClient } from '@prisma/client'
import faker from 'faker'
import request from 'supertest'

import userFactory from '../../../../../../tests/factories/userFactory'
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
          "message": "Usuário já existe",
        }
      `)
    })
  })
})
