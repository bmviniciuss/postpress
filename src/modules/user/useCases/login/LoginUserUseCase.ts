import { HashComparer } from '../../../../cryptography/Hash'
import { JWT } from '../../../../cryptography/Jwt'
import { UserRepository } from '../../repos/UserRepository'
import { LoginUserDTO, LoginUserReponseDTO, LoginUser } from './LoginUse'
import { LoginUserErrors } from './LoginUserErrors'

export class LoginUserUseCase implements LoginUser {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly hashComparer: HashComparer,
    private readonly jwt: JWT
  ) {}

  async execute (data: LoginUserDTO): Promise<LoginUserReponseDTO> {
    const user = await this.userRepository.loadByEmail(data.email)
    if (!user) throw new LoginUserErrors.UserNotFound()

    const passwordMatches = await this.hashComparer.compare(data.password, user.password)
    if (!passwordMatches) throw new LoginUserErrors.EmailOrPasswordDoesNotMatch()

    const token = await this.jwt.encrypt(user.id)
    await this.userRepository.setAccessToken(user.id, token)

    return { token: token }
  }
}
