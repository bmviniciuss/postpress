import { Hasher } from '../../../../cryptography/Hash'
import { UserRepository } from '../../repos/UserRepository'
import { RegisterUser, RegisterUserDTO, RegisterUserReponseDTO } from './RegisterUser'
import { RegisterUserErrors } from './RegisterUserErrors'

export class RegisterUserUseCase implements RegisterUser {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher
  ) {}

  async execute (data: RegisterUserDTO): Promise<RegisterUserReponseDTO> {
    const userAlreadyExists = await this.userRepository.loadByEmail(data.email)
    if (userAlreadyExists) throw new RegisterUserErrors.EmailAlreadyInUseError()

    const passwordHash = await this.hasher.hash(data.password)
    const user = await this.userRepository.register({
      ...data,
      password: passwordHash
    })

    return {
      user
    }
  }
}
