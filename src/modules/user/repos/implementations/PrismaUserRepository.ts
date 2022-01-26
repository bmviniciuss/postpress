import { PrismaClient, User } from '@prisma/client'

import { UserRepository, UserRepositoryRegisterDTO } from '../UserRepository'

export class PrismaUserRepository implements UserRepository {
  constructor (private readonly prisma: PrismaClient) {}

  register (data: UserRepositoryRegisterDTO): Promise<User> {
    throw new Error('Method not implemented.')
  }

  async loadByEmail (email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })
    if (!user) return null
    return user
  }

  async setAccessToken (userId: string, accessToken: string): Promise<boolean> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { accessToken }
    })
    return !!user
  }
}
