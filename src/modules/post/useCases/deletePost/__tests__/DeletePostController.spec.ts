import faker from 'faker'
import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../../tests/factories/userFactory'
import { noContent, notFound, serverError, unauthorized } from '../../../../../shared/infra/http/http'
import { PostErrors } from '../../../shared/PostErrors'
import { DeletePost } from '../DeletePost'
import { DeletePostController, DeletePostControllerRequest } from '../DeletePostController'
import { DeletePostErrors } from '../DeletePostErrors'

const makeSut = () => {
  const deletePostUseCaseMock = mock<DeletePost>()

  deletePostUseCaseMock.execute.mockResolvedValue()

  const sut = new DeletePostController(deletePostUseCaseMock)

  return { sut, deletePostUseCaseMock }
}

const makeRequest = (): DeletePostControllerRequest => ({
  authenticatedUser: userFactory(1),
  params: {
    postId: faker.datatype.uuid()
  }
})

describe('DeletePostController', () => {
  let request: DeletePostControllerRequest

  beforeEach(() => {
    request = makeRequest()
  })

  it('should call DeletePost with correct values', async () => {
    const { sut, deletePostUseCaseMock } = makeSut()
    await sut.handle(request)
    expect(deletePostUseCaseMock.execute).toHaveBeenCalledWith({
      postId: request.params?.postId,
      userPerformingOperation: request.authenticatedUser
    })
  })

  it('should return serverError if DeletePost throws unkown error', async () => {
    const { sut, deletePostUseCaseMock } = makeSut()
    deletePostUseCaseMock.execute.mockRejectedValueOnce(new Error())
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })

  it('should return notFound if DeletePost throws PostNotFoundError', async () => {
    const { sut, deletePostUseCaseMock } = makeSut()
    deletePostUseCaseMock.execute.mockRejectedValueOnce(new PostErrors.PostNotFound())
    const response = await sut.handle(request)
    expect(response).toEqual(notFound(new PostErrors.PostNotFound()))
  })

  it('should return unauthorized if DeletePost throws UnauthorizedToDeletePostError', async () => {
    const { sut, deletePostUseCaseMock } = makeSut()
    deletePostUseCaseMock.execute.mockRejectedValueOnce(new DeletePostErrors.UnauthorizedToDeletePostError())
    const response = await sut.handle(request)
    expect(response).toEqual(unauthorized(new DeletePostErrors.UnauthorizedToDeletePostError()))
  })

  it('should return noContent on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(request)
    expect(response).toEqual(noContent())
  })
})
