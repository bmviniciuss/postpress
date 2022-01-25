
import { Controller } from '../../../../shared/infra/http/Controller'
import { badRequest, HttpResponse, ok, serverError } from '../../../../shared/infra/http/http'
import { Validator } from '../../../../validation/Validator'
import { LoginUser } from './LoginUse'
import { LoginUserErrors } from './LoginUserErrors'

export type LoginUserControllerRequestDTO = {
  email: string
  password: string
}

export type LoginUserControllerResponseDTO = {
  token: string
}

export class LoginUserController extends Controller {
  constructor (
    private readonly validator: Validator,
    private readonly useCase: LoginUser
  ) {
    super()
  }

  async execute (httpRequest: LoginUserControllerRequestDTO): Promise<HttpResponse<any>> {
    try {
      const validationError = this.validator.validate(httpRequest)
      console.log('AQUIIIII\n\n\n\n', validationError)

      if (validationError) return badRequest(validationError)
      const accessToken = await this.useCase.execute(httpRequest)
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
