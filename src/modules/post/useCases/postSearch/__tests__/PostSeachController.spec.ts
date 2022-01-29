import faker from 'faker'
import { mock } from 'jest-mock-extended'

import presentationPostFactory from '../../../../../../tests/factories/presentationPostFactory'
import userFactory from '../../../../../../tests/factories/userFactory'
import { ok, serverError } from '../../../../../shared/infra/http/http'
import { PostSearch } from '../PostSearch'
import { PostSearchController, PostSearchControllerRequest } from '../PostSearchController'

const makeSut = () => {
  const postSearchUseCaseMock = mock<PostSearch>()

  // golden path mock
  const posts = presentationPostFactory(2)
  postSearchUseCaseMock.execute.mockResolvedValue({ posts })
  const sut = new PostSearchController(postSearchUseCaseMock)

  return {
    sut,
    postSearchUseCaseMock,
    posts
  }
}

const makeRequest = (): PostSearchControllerRequest => ({
  authenticatedUser: userFactory(1),
  query: {
    q: faker.random.words()
  }
})

describe('PostSearchController', () => {
  let request:PostSearchControllerRequest

  beforeEach(() => {
    request = makeRequest()
  })

  it('should call PostSearch with correct value based on request params', async () => {
    const { sut, postSearchUseCaseMock } = makeSut()
    await sut.execute(request)
    expect(postSearchUseCaseMock.execute).toHaveBeenCalledWith({
      searchTerm: request.query!.q
    })
  })

  it('should call PostSearch with empty object if no query params is provided', async () => {
    const { sut, postSearchUseCaseMock } = makeSut()
    await sut.execute({
      authenticatedUser: request.authenticatedUser,
      query: undefined
    })
    expect(postSearchUseCaseMock.execute).toHaveBeenCalledWith({})
  })

  it('should return serverError if PostSearch throws an error', async () => {
    const { sut, postSearchUseCaseMock } = makeSut()
    postSearchUseCaseMock.execute.mockRejectedValueOnce(new Error())
    const result = await sut.execute(request)
    expect(result).toEqual(serverError(new Error()))
  })

  it('should return posts on success', async () => {
    const { sut, posts } = makeSut()
    const result = await sut.execute(request)
    expect(result).toEqual(ok(posts))
  })
})
