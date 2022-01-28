import { mock } from 'jest-mock-extended'

import presentationPostFactory from '../../../../../../tests/factories/presentationPostFactory'
import { ok, serverError } from '../../../../../shared/infra/http/http'
import { GetPosts } from '../GetPosts'
import { GetPostsController } from '../GetPostsController'

const makeSut = () => {
  const getPostsMock = mock<GetPosts>()

  const posts = presentationPostFactory(2)

  // golden path mock
  getPostsMock.execute.mockResolvedValue({ posts })
  const sut = new GetPostsController(getPostsMock)

  return {
    sut,
    getPostsMock,
    posts
  }
}

describe('GetPostsController', () => {
  it('should call GetPosts use case', async () => {
    const { sut, getPostsMock } = makeSut()
    await sut.execute()
    expect(getPostsMock.execute).toHaveBeenCalled()
  })

  it('should return server error if GetPosts throws', async () => {
    const { sut, getPostsMock } = makeSut()
    getPostsMock.execute.mockRejectedValueOnce(new Error())
    const result = await sut.execute()
    expect(result).toEqual(serverError(new Error()))
  })

  it('should return ok with PresentationUsers', async () => {
    const { sut, posts } = makeSut()
    const result = await sut.execute()
    expect(result).toEqual(ok(posts))
  })
})
