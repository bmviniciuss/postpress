import { Controller } from '../../../../shared/infra/http/Controller'
import { HttpAuthenticatedRequest, HttpResponse, noContent, notFound, serverError, unauthorized } from '../../../../shared/infra/http/http'
import { PostErrors } from '../../shared/PostErrors'
import { DeletePost } from './DeletePost'
import { DeletePostErrors } from './DeletePostErrors'

export type DeletePostControllerRequest = HttpAuthenticatedRequest<undefined, {
  postId: string
}>

export class DeletePostController extends Controller {
  constructor (
    private readonly deletePostUseCase: DeletePost
  ) {
    super()
  }

  async execute (request: DeletePostControllerRequest): Promise<HttpResponse<any>> {
    try {
      await this.deletePostUseCase.execute({
        postId: request.params!.postId,
        userPerformingOperation: request.authenticatedUser
      })
      return noContent()
    } catch (error) {
      if (error instanceof Error) {
        switch (error.constructor) {
          case PostErrors.PostNotFound:
            return notFound(error)
          case DeletePostErrors.UnauthorizedToDeletePostError:
            return unauthorized(error)
        }
      }
      return serverError(error)
    }
  }
}
