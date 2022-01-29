import { Controller } from '../../../../shared/infra/http/Controller'
import { HttpAuthenticatedRequest, HttpResponse, ok, serverError } from '../../../../shared/infra/http/http'
import { PostSearch, PostSearchInputDTO } from './PostSearch'

export type PostSearchControllerRequest = HttpAuthenticatedRequest<undefined, undefined, {
  q?: string
}>

export class PostSearchController extends Controller {
  constructor (private readonly postSearch: PostSearch) {
    super()
  }

  async execute (request: PostSearchControllerRequest): Promise<HttpResponse<any>> {
    try {
      const postSearchInput = this.makePostSearchInput(request)
      const { posts } = await this.postSearch.execute(postSearchInput)
      return ok(posts)
    } catch (error) {
      return serverError(error)
    }
  }

  private makePostSearchInput (request: PostSearchControllerRequest): PostSearchInputDTO {
    const queryParams: PostSearchInputDTO = {}
    if (request?.query?.q) {
      queryParams.searchTerm = request.query.q
    }
    return queryParams
  }
}
