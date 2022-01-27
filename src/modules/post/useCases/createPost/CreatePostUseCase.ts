import { PostMapper } from '../../models/mapper/PostMapper'
import { PresentationPost } from '../../models/PresentationPost'
import { PostRepository } from '../../repos/PostRepository'
import { CreatePost, CreatePostInputDTO } from './CreatePost'

export class CreatePostUseCase implements CreatePost {
  constructor (private readonly postRepository: PostRepository) {}

  async execute (data: CreatePostInputDTO): Promise<PresentationPost> {
    const createdPost = await this.postRepository.create({
      title: data.title,
      content: data.content,
      userId: data.user.id
    })
    return PostMapper.toPresentation(createdPost)
  }
}
