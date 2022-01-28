import faker from 'faker'
import { mock } from 'jest-mock-extended'

import presentationPostFactory from '../../../../../../tests/factories/presentationPostFactory'
import { notFound, ok, serverError } from '../../../../../shared/infra/http/http'
import { PostErrors } from '../../../shared/PostErrors'
import { GetPost } from '../GetPost'
import { GetPostController, GetPostControllerRequest } from '../GetPostController'

const makeSut = () => {
  const getPostMock = mock<GetPost>()

  // golden path mock
  const post = presentationPostFactory(1)
  getPostMock.execute.mockResolvedValue({ post })

  const sut = new GetPostController(getPostMock)

  return {
    sut,
    getPostMock,
    post
  }
}

const makeRequest = (): GetPostControllerRequest => ({
  params: {
    postId: faker.datatype.uuid()
  }
})

describe('GetPostController', () => {
  let request: GetPostControllerRequest

  beforeEach(() => {
    request = makeRequest()
  })

  it('should call GetPost with correct value', async () => {
    const { sut, getPostMock } = makeSut()
    await sut.execute(request)
    expect(getPostMock.execute).toHaveBeenCalledWith({
      postId: request.params?.postId
    })
  })

  it('should return notFound if GetUsers throws a PostErrors.PostNotFound errors', async () => {
    const { sut, getPostMock } = makeSut()
    getPostMock.execute.mockRejectedValueOnce(new PostErrors.PostNotFound())
    const result = await sut.execute(request)
    expect(result).toEqual(notFound(new PostErrors.PostNotFound()))
  })

  it('should return serverError if GetUsers throws a unkown error', async () => {
    const { sut, getPostMock } = makeSut()
    getPostMock.execute.mockRejectedValueOnce(new Error())
    const result = await sut.execute(request)
    expect(result).toEqual(serverError(new Error()))
  })

  it('should return ok with post on success', async () => {
    const { sut, post } = makeSut()
    const result = await sut.execute(request)
    expect(result).toEqual(ok(post))
  })
})
