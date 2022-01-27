import { PresentationUser } from '../../models/PresentationUser'

export interface GetUserInputDTO {
  userId: string
}

export interface GetUserReponseDTO {
  user: PresentationUser
}

export interface GetUser {
  execute(data: GetUserInputDTO): Promise<GetUserReponseDTO>
}
