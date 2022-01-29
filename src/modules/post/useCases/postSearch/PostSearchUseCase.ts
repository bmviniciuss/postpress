import { PostMapper } from '../../models/mapper/PostMapper'
import { PostRepository } from '../../repos/PostRepository'
import { PostSearch, PostSearchInputDTO, PostSearchReponseDTO } from './PostSearch'

export class PostSearchUseCase implements PostSearch {
  constructor (private readonly postRepostiory: PostRepository) {}

  async execute (data: PostSearchInputDTO): Promise<PostSearchReponseDTO> {
    const posts = await this.postRepostiory.findBySearch({
      searchTerm: data.searchTerm
    })

    return { posts: PostMapper.toPresentations(posts) }
  }
}
