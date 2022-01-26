import { User } from '@prisma/client'

import { PresentationUser } from '../PresentationUser'

export class UserMapper {
  static toPresentation (userFromDb: User): PresentationUser {
    return {
      id: userFromDb.id,
      displayName: userFromDb.displayName,
      email: userFromDb.email,
      image: userFromDb.image
    }
  }

  static toPresentations (usersFromDb: User[]): PresentationUser[] {
    return usersFromDb.map(UserMapper.toPresentation)
  }
}
