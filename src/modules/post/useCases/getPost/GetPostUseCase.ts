import { PostMapper } from '../../models/mapper/PostMapper'
import { PostRepository } from '../../repos/PostRepository'
import { PostErrors } from '../../shared/PostErrors'
import { GetPost, GetPostInputDTO, GetPostReponseDTO } from './GetPost'

export class GetPostUseCase implements GetPost {
  constructor (private readonly postRepository: PostRepository) {}

  async execute (data: GetPostInputDTO): Promise<GetPostReponseDTO> {
    const post = await this.postRepository.loadById(data.postId)
    if (!post) throw new PostErrors.PostNotFound()

    const presentationPost = PostMapper.toPresentation(post)
    return { post: presentationPost }
  }
}
