import { PostWithUser } from '../../repos/PostRepository'
import { PresentationPost } from '../PresentationPost'

export class PostMapper {
  static toPresentation (source: PostWithUser): PresentationPost {
    return {
      id: source.id,
      title: source.title,
      content: source.content,
      user: {
        id: source.user.id,
        displayName: source.user.displayName,
        email: source.user.email,
        image: source.user.image
      },
      published: source.published,
      updated: source.updated
    }
  }
}
