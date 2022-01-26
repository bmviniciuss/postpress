import faker from 'faker'
import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../../tests/factories/userFactory'
import { notFound, ok, serverError } from '../../../../../shared/infra/http/http'
import { UserMapper } from '../../../models/mappers/UserMapper'
import { GetUser } from '../GetUser'
import { GetUserController, GetUserControllerRequest } from '../GetUserController'
import { GetUserErrors } from '../GetUserErrors'

const makeSut = () => {
  const getUserMock = mock<GetUser>()

  const user = UserMapper.toPresentation(userFactory(1))

  // golden paath mock
  getUserMock.execute.mockResolvedValue({ user })

  const sut = new GetUserController(getUserMock)

  return {
    sut,
    getUserMock,
    user
  }
}

const makeParams = (): GetUserControllerRequest => {
  return {
    params: {
      userId: faker.datatype.uuid()
    }
  }
}

describe('GetUserController', () => {
  let params: GetUserControllerRequest

  beforeEach(() => {
    params = makeParams()
  })

  it('should call GetUser with correct value', async () => {
    const { sut, getUserMock } = makeSut()
    await sut.execute(params)
    expect(getUserMock.execute).toHaveBeenCalledWith({
      userId: params.params?.userId!
    })
  })

  it('should return notFound if GetUser throws a GetUserErrors.UserNotFound', async () => {
    const { sut, getUserMock } = makeSut()
    getUserMock.execute.mockRejectedValueOnce(new GetUserErrors.UserNotFound())
    const result = await sut.execute(params)
    expect(result).toEqual(notFound(new GetUserErrors.UserNotFound()))
  })

  it('should return serverError if GetUser throws other error type', async () => {
    const { sut, getUserMock } = makeSut()
    getUserMock.execute.mockRejectedValueOnce(new Error())
    const result = await sut.execute(params)
    expect(result).toEqual(serverError(new Error()))
  })

  it('should return serverError if GetUser throws other error type', async () => {
    const { sut, user } = makeSut()
    const result = await sut.execute(params)
    expect(result).toEqual(ok(user))
  })
})
