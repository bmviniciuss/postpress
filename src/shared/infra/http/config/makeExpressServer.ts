import { PrismaClient } from '@prisma/client'
import express from 'express'

import { makeLoginRouter } from '../routes/login'

export const makeExpressServer = (prisma: PrismaClient) => {
  const app = express()

  app.use(express.json())

  app.get('/', (req, res) => {
    return res.send({ hello: 'World' })
  })

  app.use(makeLoginRouter(prisma))
  return app
}
