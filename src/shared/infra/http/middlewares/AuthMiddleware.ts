
import { JWT } from '../../../../cryptography/Jwt'
import { UserRepository } from '../../../../modules/user/repos/UserRepository'
import { AppErrors } from '../../../errors/AppErrors'
import { HttpResponse, ok, unauthorized } from '../http'
import { Middleware } from '../Middleware'

export type AuthMidddlewareRequest = {
  accessToken?: string
}
export class AuthMidddleware implements Middleware {
  constructor (
    private readonly jwt: JWT,
    private readonly userRepository: UserRepository
  ) { }

  async handle (httpRequest: AuthMidddlewareRequest): Promise<HttpResponse<any>> {
    const { accessToken = '' } = httpRequest
    const token = this.getToken(accessToken)

    if (token) {
      const decodedToken = await this.jwt.decrypt(token)
      if (!decodedToken) return unauthorized(new AppErrors.ExpiredOrInvalidTokenError())

      const userId = decodedToken.sub
      const authenticatedUser = await this.userRepository.loadUserFromTokenAndId(userId, token)
      if (!authenticatedUser) return unauthorized(new AppErrors.ExpiredOrInvalidTokenError())

      return ok({ authenticatedUser })
    }

    return unauthorized(new AppErrors.TokenNotFoundError())
  }

  private getToken (authorizationHeader = '') {
    if (!authorizationHeader) return null
    const header = authorizationHeader.split('Bearer')
    if (!header[1]) return null
    return header[1].trim()
  }
}
