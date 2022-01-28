import { PrismaClient } from '@prisma/client'

import { PostRepository, PostRepositoryCreateDTO, PostRepositoryUpdateDTO, PostWithUser } from '../PostRepository'

export class PrismaPostRepository implements PostRepository {
  constructor (private readonly prisma: PrismaClient) {}

  create (data: PostRepositoryCreateDTO): Promise<PostWithUser> {
    const { userId, ...postData } = data
    return this.prisma.post.create({
      data: {
        ...postData,
        user: {
          connect: {
            id: userId
          }
        }
      },
      include: {
        user: true
      }
    })
  }

  getAll (): Promise<PostWithUser[]> {
    return this.prisma.post.findMany({
      include: { user: true }
    })
  }

  loadById (id: string): Promise<PostWithUser | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: { user: true }
    })
  }

  update (postId: string, dataToUpdate: PostRepositoryUpdateDTO): Promise<PostWithUser> {
    return this.prisma.post.update({
      where: { id: postId },
      data: dataToUpdate,
      include: {
        user: true
      }
    })
  }
}
