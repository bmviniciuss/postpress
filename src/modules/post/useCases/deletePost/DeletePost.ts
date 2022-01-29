import { User } from '@prisma/client'

export interface DeletePostInputDTO {
  postId: string
  userPerformingOperation: User
}

export interface DeletePost {
  execute(data: DeletePostInputDTO): Promise<void>
}
