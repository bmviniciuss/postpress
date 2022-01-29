import { PrismaClient } from '@prisma/client'
import Joi from 'joi'

import { JoiValidatorAdapter } from '../../../../infra/adapters/validation/JoiValidationAdapter'
import { PrismaPostRepository } from '../../../../modules/post/repos/implementations/PrismaPostRepository'
import { CreatePostController } from '../../../../modules/post/useCases/createPost/CreatePostController'
import { CreatePostUseCase } from '../../../../modules/post/useCases/createPost/CreatePostUseCase'
import { DeletePostController } from '../../../../modules/post/useCases/deletePost/DeletePostController'
import { DeletePostUseCase } from '../../../../modules/post/useCases/deletePost/DeletePostUseCase'
import { GetPostController } from '../../../../modules/post/useCases/getPost/GetPostController'
import { GetPostUseCase } from '../../../../modules/post/useCases/getPost/GetPostUseCase'
import { GetPostsController } from '../../../../modules/post/useCases/getPosts/GetPostsController'
import { GetPostsUseCase } from '../../../../modules/post/useCases/getPosts/GetPostsUseCase'
import { PostSearchController } from '../../../../modules/post/useCases/postSearch/PostSearchController'
import { PostSearchUseCase } from '../../../../modules/post/useCases/postSearch/PostSearchUseCase'
import { UpdatePostController } from '../../../../modules/post/useCases/updatePost/UpdatePostController'
import { UpdatePostUseCase } from '../../../../modules/post/useCases/updatePost/UpdatePostUseCase'

export const makeCreatePostController = (prisma: PrismaClient) => {
  const createPostValidation = new JoiValidatorAdapter(Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
  }))

  const prismaPostRepository = new PrismaPostRepository(prisma)
  const createPostUseCase = new CreatePostUseCase(prismaPostRepository)

  return new CreatePostController(createPostValidation, createPostUseCase)
}

export const makeGetPostsController = (prisma: PrismaClient) => {
  const prismaPostRepository = new PrismaPostRepository(prisma)
  const getPostsUseCase = new GetPostsUseCase(prismaPostRepository)
  return new GetPostsController(getPostsUseCase)
}

export const makeGetPostController = (prisma: PrismaClient) => {
  const prismaPostRepository = new PrismaPostRepository(prisma)
  const getPostUseCase = new GetPostUseCase(prismaPostRepository)
  return new GetPostController(getPostUseCase)
}

export const makeUpdatePostController = (prisma: PrismaClient) => {
  const updatePostValidator = new JoiValidatorAdapter(Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
  }))
  const prismaPostRepository = new PrismaPostRepository(prisma)
  const updatePostUseCase = new UpdatePostUseCase(prismaPostRepository)
  return new UpdatePostController(updatePostValidator, updatePostUseCase)
}

export const makePostSearchController = (prisma: PrismaClient) => {
  const prismaPostRepository = new PrismaPostRepository(prisma)
  const postSearchUseCase = new PostSearchUseCase(prismaPostRepository)
  return new PostSearchController(postSearchUseCase)
}

export const makeDeletePostController = (prisma: PrismaClient) => {
  const prismaPostRepository = new PrismaPostRepository(prisma)
  const deletePostUseCase = new DeletePostUseCase(prismaPostRepository)
  return new DeletePostController(deletePostUseCase)
}
