
import { JWT } from '../../../../cryptography/Jwt'
import { UserRepository } from '../../../../modules/user/repos/UserRepository'
import { AppErrors } from '../../../errors/AppErrors'
import { HttpResponse, ok, unauthorized } from '../http'
import { Middleware } from '../Middleware'

export class AuthMidddleware implements Middleware {
  constructor (
    private readonly jwt: JWT,
    private readonly userRepository: UserRepository
  ) { }

  async handle (httpRequest: any): Promise<HttpResponse<any>> {
    const { accessToken = '' } = httpRequest || {}

    if (accessToken) {
      const decodedToken = await this.jwt.decrypt(accessToken)
      if (!decodedToken) return unauthorized(new AppErrors.ExpiredOrInvalidTokenError())

      const userId = decodedToken.sub
      const authenticatedUser = await this.userRepository.loadUserFromTokenAndId(userId, accessToken)
      if (!authenticatedUser) return unauthorized(new AppErrors.ExpiredOrInvalidTokenError())

      return ok({ authenticatedUser })
    }

    return unauthorized(new AppErrors.TokenNotFoundError())
  }
}
