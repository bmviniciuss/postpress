import { User } from '@prisma/client'

import { PresentationPost } from '../../models/PresentationPost'

export interface CreatePostInputDTO {
  title: string
  content: string
  user: User
}

export interface CreatePost {
  execute(data: CreatePostInputDTO): Promise<PresentationPost>
}
