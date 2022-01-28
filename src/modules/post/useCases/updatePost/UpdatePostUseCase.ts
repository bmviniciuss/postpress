import { PresentationPost } from '../../models/PresentationPost'
import { PostRepository } from '../../repos/PostRepository'
import { PostErrors } from '../../shared/PostErrors'
import { UpdatePost, UpdatePostInputDTO } from './UpdatePost'
import { UpdatePostError } from './UpdatePostErrors'

export class UpdatePostUseCase implements UpdatePost {
  constructor (
    private readonly postRepository: PostRepository
  ) {}

  async execute (data: UpdatePostInputDTO): Promise<PresentationPost> {
    const post = await this.postRepository.loadById(data.postId)
    if (!post) throw new PostErrors.PostNotFound()

    if (post.user.id !== data.userPerformingOperation.id) {
      throw new UpdatePostError.UnauthorizedToUpdatePostError()
    }

    return await this.postRepository.update(
      data.postId,
      {
        title: data.title,
        content: data.content
      })
  }
}
