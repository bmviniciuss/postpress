import { PostRepository } from '../../repos/PostRepository'
import { PostErrors } from '../../shared/PostErrors'
import { DeletePost, DeletePostInputDTO } from './DeletePost'
import { DeletePostErrors } from './DeletePostErrors'

export class DeletePostUseCase implements DeletePost {
  constructor (private readonly postRepository: PostRepository) {}

  async execute (data: DeletePostInputDTO): Promise<void> {
    const post = await this.postRepository.loadById(data.postId)
    if (!post) throw new PostErrors.PostNotFound()

    if (post.user.id !== data.userPerformingOperation.id) {
      throw new DeletePostErrors.UnauthorizedToDeletePostError()
    }

    await this.postRepository.deletePostById(data.postId)
  }
}
