import { PrismaClient } from '@prisma/client'
import express from 'express'

import { makeLoginRouter } from '../routes/login'
import { makePostRoutes } from '../routes/post'
import { makeUsersRouter } from '../routes/user'

export const makeExpressServer = (prisma: PrismaClient) => {
  const app = express()

  app.use(express.json())

  app.get('/', (req, res) => {
    return res.send({ hello: 'World' })
  })

  app.use(makeLoginRouter(prisma))
  app.use(makeUsersRouter(prisma))
  app.use(makePostRoutes(prisma))
  return app
}
