import { UserMapper } from '../../models/mappers/UserMapper'
import { UserRepository } from '../../repos/UserRepository'
import { GetUser, GetUserInputDTO, GetUserReponseDTO } from './GetUser'
import { GetUserErrors } from './GetUserErrors'

export class GetUserUseCase implements GetUser {
  constructor (private readonly userRepository: UserRepository) {}

  async execute (data: GetUserInputDTO): Promise<GetUserReponseDTO> {
    const user = await this.userRepository.loadById(data.userId)
    if (!user) throw new GetUserErrors.UserNotFound()

    const presentationUser = UserMapper.toPresentation(user)
    return { user: presentationUser }
  }
}
