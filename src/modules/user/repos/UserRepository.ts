import { User } from '@prisma/client'

export interface UserRepositoryRegisterDTO {
  email: string
  password: string
  displayName: string | null
  image: string | null
}

export interface UserRepository {
  loadByEmail(email: string): Promise<User | null>
  setAccessToken(userId: string, accessToken: string): Promise<boolean>
  register(data: UserRepositoryRegisterDTO): Promise<User>
}
