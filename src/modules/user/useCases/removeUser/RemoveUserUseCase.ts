import { UserRepository } from '../../repos/UserRepository'
import { RemoveUser, RemoveUserInputDTO } from './RemoveUser'

export class RemoveUserUseCase implements RemoveUser {
  constructor (private readonly userRepository: UserRepository) {}

  async execute (data: RemoveUserInputDTO): Promise<void> {
    await this.userRepository.deleteUserById(data.userId)
  }
}
