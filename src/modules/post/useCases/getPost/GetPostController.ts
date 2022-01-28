import { Controller } from '../../../../shared/infra/http/Controller'
import { HttpRequest, HttpResponse, notFound, ok, serverError } from '../../../../shared/infra/http/http'
import { PostErrors } from '../../shared/PostErrors'
import { GetPost } from './GetPost'

export type GetPostControllerRequest = HttpRequest<any, {
  postId: string
}>

export class GetPostController extends Controller {
  constructor (private readonly getPost: GetPost) {
    super()
  }

  async execute (data: GetPostControllerRequest): Promise<HttpResponse<any>> {
    try {
      const { post } = await this.getPost.execute({
        postId: data.params?.postId!
      })
      return ok(post)
    } catch (error) {
      if (error instanceof Error) {
        switch (error.constructor) {
          case PostErrors.PostNotFound:
            return notFound(error)
        }
      }
      return serverError(error)
    }
  }
}
