import { Controller } from '../../../../shared/infra/http/Controller'
import { badRequest, created, HttpAuthenticatedRequest, HttpResponse, serverError } from '../../../../shared/infra/http/http'
import { Validator } from '../../../../validation/Validator'
import { PresentationCreatedPost } from '../../models/PresentationCreatedPost'
import { CreatePost } from './CreatePost'

export type CreatePostControllerRequest = HttpAuthenticatedRequest<{
  title: string
  content: string
}>

export class CreatePostController extends Controller {
  constructor (
    private readonly validator: Validator,
    private readonly createPostUseCase: CreatePost
  ) {
    super()
  }

  async execute (httpRequest: CreatePostControllerRequest): Promise<HttpResponse<any>> {
    try {
      const validationError = this.validator.validate(httpRequest.body)
      if (validationError) return badRequest(validationError)

      const createdPost = await this.createPostUseCase.execute({
        title: httpRequest.body!.title,
        content: httpRequest.body!.content,
        user: httpRequest.authenticatedUser
      })

      const createdPostFormatted: PresentationCreatedPost = {
        content: createdPost.content,
        title: createdPost.title,
        userId: createdPost.user.id
      }

      return created(createdPostFormatted)
    } catch (error) {
      return serverError(error)
    }
  }
}
