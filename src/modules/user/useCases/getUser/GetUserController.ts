import { Controller } from '../../../../shared/infra/http/Controller'
import { HttpRequest, HttpResponse, notFound, ok, serverError } from '../../../../shared/infra/http/http'
import { GetUser } from './GetUser'
import { GetUserErrors } from './GetUserErrors'

export type GetUserControllerRequest = HttpRequest<any, {
  userId: string
}>

export class GetUserController extends Controller {
  constructor (private readonly getUser: GetUser) {
    super()
  }

  async execute (data: GetUserControllerRequest): Promise<HttpResponse<any>> {
    try {
      const { user } = await this.getUser.execute({
        userId: data.params?.userId!
      })
      return ok(user)
    } catch (error) {
      if (error instanceof Error) {
        switch (error.constructor) {
          case GetUserErrors.UserNotFound:
            return notFound(error)
        }
      }
      return serverError(error)
    }
  }
}
