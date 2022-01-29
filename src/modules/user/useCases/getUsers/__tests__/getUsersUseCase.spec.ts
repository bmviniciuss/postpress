import { mock } from 'jest-mock-extended'
import { pick } from 'lodash'

import userFactory from '../../../../../../tests/factories/userFactory'
import { UserRepository } from '../../../repos/UserRepository'
import { GetUsersUseCase } from '../GetUsersUseCase'

const makeSut = () => {
  const userRepositoryMock = mock<UserRepository>()
  const users = userFactory(2)

  // golden path mock
  userRepositoryMock.listAll.mockResolvedValue(users)

  const sut = new GetUsersUseCase(userRepositoryMock)
  return { sut, userRepositoryMock, users }
}

describe('GetUsersUseCase', () => {
  it('should call UserRepository.listAll', async () => {
    const { sut, userRepositoryMock } = makeSut()
    await sut.execute()
    expect(userRepositoryMock.listAll).toHaveBeenCalled()
  })

  it('should return mapped users', async () => {
    const { sut, users } = makeSut()
    const results = await sut.execute()
    expect(results.users).toEqual(users.map(u => pick(u, 'id', 'displayName', 'email', 'image')))
  })
})
