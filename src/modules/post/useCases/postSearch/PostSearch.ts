import { PresentationPost } from '../../models/PresentationPost'

export interface PostSearchInputDTO {
  searchTerm?: string
}

export interface PostSearchReponseDTO {
  posts: PresentationPost[]
}

export interface PostSearch {
  execute(data: PostSearchInputDTO): Promise<PostSearchReponseDTO>
}
