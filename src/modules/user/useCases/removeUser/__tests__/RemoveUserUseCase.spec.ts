import faker from 'faker'
import { mock } from 'jest-mock-extended'

import { UserRepository } from '../../../repos/UserRepository'
import { RemoveUserInputDTO } from '../RemoveUser'
import { RemoveUserUseCase } from '../RemoveUserUseCase'

const makeSut = () => {
  const userRepositoryMock = mock<UserRepository>()
  const sut = new RemoveUserUseCase(userRepositoryMock)

  return {
    sut,
    userRepositoryMock
  }
}

const makeInput = (): RemoveUserInputDTO => ({
  userId: faker.datatype.uuid()
})

describe('RemoveUserUseCase', () => {
  let input: RemoveUserInputDTO

  beforeEach(() => {
    input = makeInput()
  })

  it('should call UserRepository.deleteById with correct value', async () => {
    const { sut, userRepositoryMock } = makeSut()
    await sut.execute(input)
    expect(userRepositoryMock.deleteUserById).toHaveBeenCalledWith(input.userId)
  })

  it('should throw id UserRepository.deleteById throws', async () => {
    const { sut, userRepositoryMock } = makeSut()
    userRepositoryMock.deleteUserById.mockRejectedValueOnce(new Error())
    await expect(sut.execute(input)).rejects.toThrow()
  })

  it('should return nothing on success', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(input)
    expect(result).toBeUndefined()
  })
})
