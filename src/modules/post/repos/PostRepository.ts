import { Post, User } from '@prisma/client'

export type PostWithUser = Post & { user: User }

export interface PostRepositoryCreateDTO {
  title: string
  content: string
  userId: string
}

export interface PostRepository {
  create(data: PostRepositoryCreateDTO): Promise<PostWithUser>
  getAll(): Promise<PostWithUser[]>
}
