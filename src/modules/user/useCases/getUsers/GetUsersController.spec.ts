import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../tests/factories/userFactory'
import { ok, serverError } from '../../../../shared/infra/http/http'
import { GetUsers } from './GetUsers'
import { GetUsersController } from './GetUsersController'

const makeSut = () => {
  const getUsersMock = mock<GetUsers>()
  const sut = new GetUsersController(getUsersMock)

  return { sut, getUsersMock }
}

describe('GetUsersController', () => {
  it('should call GetUsersUseCase', async () => {
    const { sut, getUsersMock } = makeSut()
    await sut.execute()
    expect(getUsersMock.execute).toHaveBeenCalled()
  })

  it('should return server error if GetUsersUseCase throws', async () => {
    const { sut, getUsersMock } = makeSut()
    getUsersMock.execute.mockRejectedValueOnce(new Error())
    const result = await sut.execute()
    expect(result).toEqual(serverError(new Error()))
  })

  it('should return GetUsersUseCase value', async () => {
    const { sut, getUsersMock } = makeSut()
    const users = userFactory(2)
    getUsersMock.execute.mockResolvedValueOnce({ users: users })
    const result = await sut.execute()
    expect(result).toEqual(ok(users))
  })
})
