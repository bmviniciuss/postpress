import { PrismaClient } from '@prisma/client'
import express from 'express'

import { PORT } from '../../../config/env'
import { makeLoginRouter } from './routes/login'

async function bootstrap () {
  const prisma = new PrismaClient()
  const app = express()

  app.use(express.json())

  app.get('/', (req, res) => {
    return res.send({ hello: 'World' })
  })

  app.use(makeLoginRouter(prisma))

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  })
}

bootstrap()
