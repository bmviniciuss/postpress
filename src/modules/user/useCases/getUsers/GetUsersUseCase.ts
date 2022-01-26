import { UserMapper } from '../../models/mappers/UserMapper'
import { UserRepository } from '../../repos/UserRepository'
import { GetUsers, GetUsersReponseDTO } from './GetUsers'

export class GetUsersUseCase implements GetUsers {
  constructor (private readonly userRepository: UserRepository) {}

  async execute (): Promise<GetUsersReponseDTO> {
    const usersFromSource = await this.userRepository.listAll()
    const mappedUsers = UserMapper.toPresentations(usersFromSource)
    return { users: mappedUsers }
  }
}
