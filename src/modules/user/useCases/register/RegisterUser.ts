import { User } from '@prisma/client'

export interface RegisterUserDTO {
  email: string
  password: string
  displayName?: string // at least 8 chars
  image?: string
}

export interface RegisterUserReponseDTO {
  user: User
}

export interface RegisterUser {
  execute(data: RegisterUserDTO): Promise<RegisterUserReponseDTO>
}
