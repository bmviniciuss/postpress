
import { Controller } from '../../../../shared/infra/http/Controller'
import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '../../../../shared/infra/http/http'
import { Validator } from '../../../../validation/Validator'
import { LoginUser } from './LoginUser'
import { LoginUserErrors } from './LoginUserErrors'

export type LoginUserControllerBodyDTO = {
  email: string
  password: string
}

export type LoginUserControllerResponseDTO = {
  token: string
}

export type LoginUserControllerRequest = HttpRequest<LoginUserControllerBodyDTO>

export class LoginUserController extends Controller {
  constructor (
    private readonly validator: Validator,
    private readonly useCase: LoginUser
  ) {
    super()
  }

  async execute (httpRequest: LoginUserControllerRequest): Promise<HttpResponse<any>> {
    try {
      const validationError = this.validator.validate(httpRequest.body)
      if (validationError) return badRequest(validationError)
      const accessToken = await this.useCase.execute(httpRequest.body!)
      return ok(accessToken)
    } catch (error) {
      if (error instanceof Error) {
        switch (error.constructor) {
          case LoginUserErrors.EmailOrPasswordDoesNotMatch:
          case LoginUserErrors.UserNotFound:
            return badRequest(new LoginUserErrors.InvalidParamsError())
        }
      }
      return serverError(error)
    }
  }
}
