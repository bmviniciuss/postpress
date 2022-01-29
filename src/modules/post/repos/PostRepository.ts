import { Post, User } from '@prisma/client'

export type PostWithUser = Post & { user: User }

export interface PostRepositoryCreateDTO {
  title: string
  content: string
  userId: string
}

export interface PostRepositoryUpdateDTO {
  title: string
  content: string
}

export interface PostRepositoryFindBySearchDTO {
  searchTerm?: string
}

export interface PostRepository {
  create(data: PostRepositoryCreateDTO): Promise<PostWithUser>
  getAll(): Promise<PostWithUser[]>
  loadById(id: string): Promise<PostWithUser | null>
  update(postId: string, dataToUpdate: PostRepositoryUpdateDTO): Promise<PostWithUser>
  findBySearch(query?: PostRepositoryFindBySearchDTO): Promise<PostWithUser[]>
  deletePostById(id: string): Promise<PostWithUser>
}
