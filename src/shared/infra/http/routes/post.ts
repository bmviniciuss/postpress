import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import Joi from 'joi'

import { JoiValidatorAdapter } from '../../../../infra/adapters/validation/JoiValidationAdapter'
import { PrismaPostRepository } from '../../../../modules/post/repos/implementations/PrismaPostRepository'
import { CreatePostController } from '../../../../modules/post/useCases/createPost/CreatePostController'
import { CreatePostUseCase } from '../../../../modules/post/useCases/createPost/CreatePostUseCase'
import { GetPostController } from '../../../../modules/post/useCases/getPost/GetPostController'
import { GetPostUseCase } from '../../../../modules/post/useCases/getPost/GetPostUseCase'
import { GetPostsController } from '../../../../modules/post/useCases/getPosts/GetPostsController'
import { GetPostsUseCase } from '../../../../modules/post/useCases/getPosts/GetPostsUseCase'
import { PostSearchController } from '../../../../modules/post/useCases/postSearch/PostSearchController'
import { PostSearchUseCase } from '../../../../modules/post/useCases/postSearch/PostSearchUseCase'
import { UpdatePostController } from '../../../../modules/post/useCases/updatePost/UpdatePostController'
import { UpdatePostUseCase } from '../../../../modules/post/useCases/updatePost/UpdatePostUseCase'
import { expressMiddlewareAdapter } from '../../adapters/expressMiddlewareAdapter'
import { expressAuthenticatedRouteAdapter } from '../../adapters/expressRouteAdapter'
import { makeJwtAdapter } from '../../factories/makeJwtAdapter'
import { makePrismaUserRepository } from '../../factories/repositories/prisma/makePrismaUserRepository'
import { AuthMidddleware } from '../middlewares/AuthMiddleware'

const makeCreatePostController = (prisma: PrismaClient) => {
  const createPostValidation = new JoiValidatorAdapter(Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
  }))

  const prismaPostRepository = new PrismaPostRepository(prisma)
  const createPostUseCase = new CreatePostUseCase(prismaPostRepository)

  return new CreatePostController(createPostValidation, createPostUseCase)
}

const makeGetPostsController = (prisma: PrismaClient) => {
  const prismaPostRepository = new PrismaPostRepository(prisma)
  const getPostsUseCase = new GetPostsUseCase(prismaPostRepository)
  return new GetPostsController(getPostsUseCase)
}

const makeGetPostController = (prisma: PrismaClient) => {
  const prismaPostRepository = new PrismaPostRepository(prisma)
  const getPostUseCase = new GetPostUseCase(prismaPostRepository)
  return new GetPostController(getPostUseCase)
}

const makeUpdatePostController = (prisma: PrismaClient) => {
  const updatePostValidator = new JoiValidatorAdapter(Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
  }))
  const prismaPostRepository = new PrismaPostRepository(prisma)
  const updatePostUseCase = new UpdatePostUseCase(prismaPostRepository)
  return new UpdatePostController(updatePostValidator, updatePostUseCase)
}

const makePostSearchController = (prisma: PrismaClient) => {
  const prismaPostRepository = new PrismaPostRepository(prisma)
  const postSearchUseCase = new PostSearchUseCase(prismaPostRepository)
  return new PostSearchController(postSearchUseCase)
}

export const makePostRoutes = (prisma: PrismaClient) => {
  const router = Router()
  router.post('/post',
    expressMiddlewareAdapter(new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))),
    expressAuthenticatedRouteAdapter(makeCreatePostController(prisma))
  )

  router.get('/post',
    expressMiddlewareAdapter(new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))),
    expressAuthenticatedRouteAdapter(makeGetPostsController(prisma))
  )

  router.get('/post/search',
    expressMiddlewareAdapter(new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))),
    expressAuthenticatedRouteAdapter(makePostSearchController(prisma))
  )

  router.get('/post/:postId',
    expressMiddlewareAdapter(new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))),
    expressAuthenticatedRouteAdapter(makeGetPostController(prisma))
  )

  router.put('/post/:postId',
    expressMiddlewareAdapter(new AuthMidddleware(makeJwtAdapter(), makePrismaUserRepository(prisma))),
    expressAuthenticatedRouteAdapter(makeUpdatePostController(prisma))
  )
  return router
}
