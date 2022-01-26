import { Controller } from '../../../../shared/infra/http/Controller'
import { HttpAuthenticatedRequest, HttpResponse, ok, serverError } from '../../../../shared/infra/http/http'
import { GetUsers } from './GetUsers'

type GetUsersRequestDTO = HttpAuthenticatedRequest

export class GetUsersController extends Controller {
  constructor (private readonly getUsersUseCase: GetUsers) {
    super()
  }

  async execute (request: GetUsersRequestDTO): Promise<HttpResponse<any>> {
    try {
      console.log('REQUEST: ', request)

      const { users } = await this.getUsersUseCase.execute()
      return ok(users)
    } catch (error) {
      return serverError(error)
    }
  }
}
