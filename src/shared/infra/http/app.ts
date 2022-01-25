import { PrismaClient } from '@prisma/client'
import express from 'express'
import swaggerUi from 'swagger-ui-express'

import { PORT } from '../../../config/env'
import apiSchema from './docs/api-schema.json'
import { makeLoginRouter } from './routes/login'

async function bootstrap () {
  const prisma = new PrismaClient()
  const app = express()

  app.use(express.json())

  app.get('/', (req, res) => {
    return res.send({ hello: 'World' })
  })

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema, {
    explorer: true
  }))

  app.use(makeLoginRouter(prisma))

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  })
}

bootstrap()
