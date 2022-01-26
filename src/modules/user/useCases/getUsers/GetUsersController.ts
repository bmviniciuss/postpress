import { Controller } from '../../../../shared/infra/http/Controller'
import { HttpResponse, ok, serverError } from '../../../../shared/infra/http/http'
import { GetUsers } from './GetUsers'

export class GetUsersController extends Controller {
  constructor (private readonly getUsersUseCase: GetUsers) {
    super()
  }

  async execute (): Promise<HttpResponse<any>> {
    try {
      const { users } = await this.getUsersUseCase.execute()
      return ok(users)
    } catch (error) {
      return serverError(error)
    }
  }
}
