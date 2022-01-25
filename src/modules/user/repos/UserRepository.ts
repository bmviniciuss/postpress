import { User } from '@prisma/client'

export interface UserRepository {
  loadByEmail(email: string): Promise<User | null>
  setAccessToken(userId: string, accessToken: string): Promise<boolean>
}
