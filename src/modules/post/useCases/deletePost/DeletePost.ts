import { User } from '@prisma/client'

import { PresentationPost } from '../../models/PresentationPost'

export interface DeletePostInputDTO {
  postId: string
  userPerformingOperation: User
}

export interface DeletePost {
  execute(data: DeletePostInputDTO): Promise<PresentationPost>
}
