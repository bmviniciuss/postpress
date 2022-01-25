import { PrismaClient, User } from '@prisma/client'

import { UserRepository } from '../UserRepository'

export class PrismaUserRepository implements UserRepository {
  constructor (private readonly prisma: PrismaClient) {}

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
