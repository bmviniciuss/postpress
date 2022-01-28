import { PresentationPost } from '../../models/PresentationPost'

export interface GetPostsPayload {
  posts: PresentationPost[]
}

export interface GetPosts {
  execute(): Promise<GetPostsPayload>
}
