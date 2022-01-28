import { Controller } from '../../../../shared/infra/http/Controller'
import { HttpResponse, ok, serverError } from '../../../../shared/infra/http/http'
import { GetPosts } from './GetPosts'

export class GetPostsController extends Controller {
  constructor (private readonly getPosts: GetPosts) {
    super()
  }

  async execute (): Promise<HttpResponse<any>> {
    try {
      const { posts } = await this.getPosts.execute()
      return ok(posts)
    } catch (error) {
      return serverError(error)
    }
  }
}
