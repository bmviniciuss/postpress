import { PresentationPost } from '../../models/PresentationPost'

export interface GetPostInputDTO {
  postId: string
}

export interface GetPostReponseDTO {
  post: PresentationPost
}

export interface GetPost {
  execute(data: GetPostInputDTO): Promise<GetPostReponseDTO>
}
