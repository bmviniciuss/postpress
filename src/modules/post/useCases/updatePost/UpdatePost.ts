import { PresentationPost } from '../../models/PresentationPost'

export interface UpdatePostInputDTO {
  postId: string
  title: string
  content: string
}

export interface UpdatePost {
  execute(data: UpdatePostInputDTO): Promise<PresentationPost>
}
