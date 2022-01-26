import { PresentationUser } from '../../models/PresentationUser'

export interface GetUsersDTO {}

export interface GetUsersReponseDTO {
  users: PresentationUser[]
}

export interface GetUsers {
  execute(data?: GetUsersDTO | any): Promise<GetUsersReponseDTO>
}
