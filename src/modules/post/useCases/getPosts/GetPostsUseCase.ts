import { PostMapper } from '../../models/mapper/PostMapper'
import { PostRepository } from '../../repos/PostRepository'
import { GetPosts, GetPostsPayload } from './GetPosts'

export class GetPostsUseCase implements GetPosts {
  constructor (private readonly postRepository: PostRepository) {}

  async execute (): Promise<GetPostsPayload> {
    const posts = await this.postRepository.getAll()
    return { posts: PostMapper.toPresentations(posts) }
  }
}
