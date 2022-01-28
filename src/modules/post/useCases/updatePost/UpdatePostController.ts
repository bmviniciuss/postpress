import { Controller } from '../../../../shared/infra/http/Controller'
import { badRequest, HttpAuthenticatedRequest, HttpResponse, notFound, ok, serverError } from '../../../../shared/infra/http/http'
import { Validator } from '../../../../validation/Validator'
import { PresentationUpdatedPost } from '../../models/mapper/PresentationUpdatedPost'
import { PostErrors } from '../../shared/PostErrors'
import { UpdatePost, UpdatePostInputDTO } from './UpdatePost'
import { UpdatePostError } from './UpdatePostErrors'

export type UpdatePostControllerRequest = HttpAuthenticatedRequest<{
  title: string
  content: string
}, {
  postId: string
}>

export class UpdatePostController extends Controller {
  constructor (
    private readonly validator: Validator,
    private readonly updatePost: UpdatePost
  ) {
    super()
  }

  async execute (request: UpdatePostControllerRequest): Promise<HttpResponse<any>> {
    try {
      const validationError = this.validator.validate(request.body)
      if (validationError) return badRequest(validationError)

      const updatePostPayload: UpdatePostInputDTO = {
        title: request.body!.title,
        content: request.body!.content,
        postId: request.params!.postId,
        userPerformingOperation: request.authenticatedUser
      }

      const updatedPost = await this.updatePost.execute(updatePostPayload)

      const presenationUpdatedPost:PresentationUpdatedPost = {
        title: updatedPost.title,
        content: updatedPost.content,
        userId: updatedPost.user.id
      }

      return ok(presenationUpdatedPost)
    } catch (error) {
      if (error instanceof Error) {
        switch (error.constructor) {
          case UpdatePostError.UnauthorizedToUpdatePostError:
            return badRequest(error)
          case PostErrors.PostNotFound:
            return notFound(error)
        }
      }

      return serverError(error)
    }
  }
}
