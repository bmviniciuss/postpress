export interface RemoveUserInputDTO {
  userId: string
}

export interface RemoveUser {
  execute(data: RemoveUserInputDTO): Promise<void>
}
