import { User } from '@prisma/client'

import { PresentationPost } from '../../models/PresentationPost'

export interface UpdatePostInputDTO {
  postId: string
  title: string
  content: string
  userPerformingOperation: User
}

export interface UpdatePost {
  execute(data: UpdatePostInputDTO): Promise<PresentationPost>
}
