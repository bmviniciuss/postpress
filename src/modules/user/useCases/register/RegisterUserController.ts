
import { Controller } from '../../../../shared/infra/http/Controller'
import { badRequest, conflict, created, HttpResponse, serverError } from '../../../../shared/infra/http/http'
import { Validator } from '../../../../validation/Validator'
import { LoginUser } from '../login/LoginUser'
import { RegisterUser } from './RegisterUser'
import { RegisterUserErrors } from './RegisterUserErrors'

export type RegisterUserControllerRequestDTO = {
  email: string
  password: string
  displayName: string | null
  image: string | null
}

export type RegisterUserControllerResponseDTO = {
  token: string
}

// TODO: atualizar para novo padrão
export class RegisterUserController extends Controller {
  constructor (
    private readonly validator: Validator,
    private readonly registerUserUseCase: RegisterUser,
    private readonly loginUserUseCase: LoginUser
  ) {
    super()
  }

  async execute (httpRequest: RegisterUserControllerRequestDTO): Promise<HttpResponse<any>> {
    try {
      const validationError = this.validator.validate(httpRequest)
      if (validationError) return badRequest(validationError)

      const registerUserPayload = await this.registerUserUseCase.execute(httpRequest)
      const loginUserPayload = await this.loginUserUseCase.execute({
        email: registerUserPayload.user.email,
        password: httpRequest.password
      })

      return created({ token: loginUserPayload.token })
    } catch (error) {
      if (error instanceof Error) {
        switch (error.constructor) {
          case RegisterUserErrors.EmailAlreadyInUseError:
            return conflict(error)
        }
      }

      return serverError(error)
    }
  }
}
