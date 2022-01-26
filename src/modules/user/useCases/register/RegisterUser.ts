import { User } from '@prisma/client'

export interface RegisterUserDTO {
  email: string
  password: string
  displayName: string | null // at least 8 chars
  image: string | null
}

export interface RegisterUserReponseDTO {
  user: User
}

export interface RegisterUser {
  execute(data: RegisterUserDTO): Promise<RegisterUserReponseDTO>
}
