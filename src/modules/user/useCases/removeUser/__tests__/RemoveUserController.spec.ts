import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../../tests/factories/userFactory'
import { noContent, serverError } from '../../../../../shared/infra/http/http'
import { RemoveUser } from '../RemoveUser'
import { RemoveUserController, RemoveUserControllerRequest } from '../RemoveUserController'

const makeSut = () => {
  const removeUserMock = mock<RemoveUser>()
  const sut = new RemoveUserController(removeUserMock)
  return { sut, removeUserMock }
}

const makeRequestData = (): RemoveUserControllerRequest => ({
  authenticatedUser: userFactory(1)
})

describe('RemoveUserController', () => {
  let requestData: RemoveUserControllerRequest

  beforeEach(() => {
    requestData = makeRequestData()
  })

  it('should call RemoveUser use case with correct value', async () => {
    const { sut, removeUserMock } = makeSut()
    await sut.execute(requestData)
    expect(removeUserMock.execute).toHaveBeenCalledWith({
      userId: requestData.authenticatedUser.id
    })
  })

  it('should return server error if RemoveUser throws', async () => {
    const { sut, removeUserMock } = makeSut()
    removeUserMock.execute.mockRejectedValueOnce(new Error())

    const result = await sut.execute(requestData)
    expect(result).toEqual(serverError(new Error()))
  })

  it('should return no contenton success', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(requestData)
    expect(result).toEqual(noContent())
  })
})
