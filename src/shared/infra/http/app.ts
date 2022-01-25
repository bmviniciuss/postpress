import { PrismaClient } from '@prisma/client'
import swaggerUi from 'swagger-ui-express'

import { PORT } from '../../../config/env'
import { makeExpressServer } from './config/makeExpressServer'
import apiSchema from './docs/api-schema.json'

async function bootstrap () {
  const prisma = new PrismaClient()
  const app = makeExpressServer(prisma)

  if (process.env.NODE_ENV !== 'test') {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema, {
      explorer: true
    }))
  }

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  })
}

bootstrap()
