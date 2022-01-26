import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import faker from 'faker'
import request from 'supertest'

import userFactory from '../../../../../../tests/factories/userFactory'
import { makeExpressServer } from '../../config/makeExpressServer'

describe('Login Routes', () => {
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

  describe('POST /login', () => {
    it('should return 400 if no email is provided', async () => {
      const response = await request(app)
        .post('/login')
      expect(response.statusCode).toEqual(400)
      expect(response.body).toMatchInlineSnapshot(`
Object {
  "message": "\\"email\\" is required",
}
`)
    })

    it('should return 400 if no password is provided', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: faker.internet.email() })
      expect(response.statusCode).toEqual(400)
      expect(response.body).toMatchInlineSnapshot(`
Object {
  "message": "\\"password\\" is required",
}
`)
    })

    it('should return 200 with token on success', async () => {
      const password = '123456'
      const hash = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: userFactory(1, { password: hash })
      })
      const response = await request(app)
        .post('/login')
        .send({ email: user.email, password })
      expect(response.statusCode).toEqual(200)
      expect(response.body.token).toBeDefined()
    })
  })
})
