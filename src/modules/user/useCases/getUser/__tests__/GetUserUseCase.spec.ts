import faker from 'faker'
import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../../tests/factories/userFactory'
import { UserMapper } from '../../../models/mappers/UserMapper'
import { UserRepository } from '../../../repos/UserRepository'
import { GetUserInputDTO } from '../GetUser'
import { GetUserErrors } from '../GetUserErrors'
import { GetUserUseCase } from '../GetUserUseCase'

const makeSut = () => {
  const userRepositoryMock = mock<UserRepository>()
  const user = userFactory(1)

  // golden paath mock
  userRepositoryMock.loadById.mockResolvedValue(user)

  const sut = new GetUserUseCase(userRepositoryMock)

  return {
    sut,
    userRepositoryMock,
    user
  }
}

const makeParams = (): GetUserInputDTO => ({
  userId: faker.datatype.uuid()
})

describe('GetUserUseCase', () => {
  let params: GetUserInputDTO

  beforeEach(() => {
    params = makeParams()
  })

  it('should call UserRepository.loadById with correct value', async () => {
    const { sut, userRepositoryMock } = makeSut()
    await sut.execute(params)
    expect(userRepositoryMock.loadById).toHaveBeenCalledWith(params.userId)
  })

  it('should throw a GetUserErrors.UserNotFound if UserRepository.loadById returns null', async () => {
    const { sut, userRepositoryMock } = makeSut()
    userRepositoryMock.loadById.mockResolvedValueOnce(null)
    await expect(sut.execute(params)).rejects.toThrow(new GetUserErrors.UserNotFound())
  })

  it('should return PresentationUser on success', async () => {
    const { sut, user } = makeSut()
    const result = await sut.execute(params)
    await expect(result).toEqual({ user: UserMapper.toPresentation(user) })
  })
})
