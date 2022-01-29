import { Prisma, PrismaClient } from '@prisma/client'

import { PostRepository, PostRepositoryCreateDTO, PostRepositoryFindBySearchDTO, PostRepositoryUpdateDTO, PostWithUser } from '../PostRepository'

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

  findBySearch (query?: PostRepositoryFindBySearchDTO): Promise<PostWithUser[]> {
    let where: Prisma.PostWhereInput = {}

    if (query?.searchTerm) {
      const searchTerm = query.searchTerm
      where = {
        ...where,
        OR: [
          { title: { contains: searchTerm } },
          { content: { contains: searchTerm } }
        ]
      }
    }

    return this.prisma.post.findMany({
      where,
      include: { user: true }
    })
  }
}
