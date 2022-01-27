import { Controller } from '../../../../shared/infra/http/Controller'
import { HttpAuthenticatedRequest, HttpResponse, noContent, serverError } from '../../../../shared/infra/http/http'
import { RemoveUser } from './RemoveUser'

export type RemoveUserControllerRequest = HttpAuthenticatedRequest<any, any>

export class RemoveUserController extends Controller {
  constructor (private readonly removeUserUseCase: RemoveUser) {
    super()
  }

  async execute (httpRequest: RemoveUserControllerRequest): Promise<HttpResponse<any>> {
    try {
      await this.removeUserUseCase.execute({
        userId: httpRequest.authenticatedUser.id
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
