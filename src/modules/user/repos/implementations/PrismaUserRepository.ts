import { PrismaClient, User } from '@prisma/client'

import { UserRepository, UserRepositoryRegisterDTO } from '../UserRepository'

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

  register (data: UserRepositoryRegisterDTO): Promise<User> {
    return this.prisma.user.create({
      data
    })
  }

  listAll (): Promise<User[]> {
    return this.prisma.user.findMany({})
  }

  async loadUserFromTokenAndId (id: string, token: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { id, accessToken: token }
    })
  }

  async loadById (id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id }
    })
  }

  async deleteUserById (id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id }
    })
  }
}
