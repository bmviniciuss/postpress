export interface LoginUserDTO {
  email: string
  password: string
}

export interface LoginUserReponseDTO {
  token: string
}

export interface LoginUser {
  execute(data: LoginUserDTO): Promise<LoginUserReponseDTO>
}
