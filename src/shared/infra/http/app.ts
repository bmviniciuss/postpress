import { PrismaClient } from '@prisma/client'
import Fastify from 'fastify'
import fastifyBlipp from 'fastify-blipp'

import { makeAuthRoutes } from './routes/auth'

async function bootstrap () {
  const prisma = new PrismaClient()

  const server = Fastify({
    logger: true
  })

  server.register(fastifyBlipp)
  server.get('/', async (request, reply) => {
    return 'Hello World'
  })

  server.register(makeAuthRoutes(prisma))

  const start = async () => {
    try {
      await server.listen(3000)
      server.blipp()
    } catch (err) {
      server.log.error(err)
      console.error(err)
      process.exit(1)
    }
  }

  start()
}

bootstrap()
