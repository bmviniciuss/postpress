import faker from 'faker'
import { mock } from 'jest-mock-extended'

import postWithUserFactory from '../../../../../../tests/factories/postWithUserFactory'
import { PostRepository } from '../../../repos/PostRepository'
import { PostErrors } from '../../../shared/PostErrors'
import { GetPostInputDTO } from '../GetPost'
import { GetPostUseCase } from '../GetPostUseCase'

const makeSut = () => {
  const postRepositoryMock = mock<PostRepository>()

  const postWithUser = postWithUserFactory(1)
  // golden path mock
  postRepositoryMock.loadById.mockResolvedValue(postWithUser)

  const sut = new GetPostUseCase(postRepositoryMock)

  return {
    sut,
    postRepositoryMock,
    postWithUser
  }
}

const makeInput = (): GetPostInputDTO => ({
  postId: faker.datatype.uuid()
})

describe('GetPostUseCase', () => {
  let input: GetPostInputDTO

  beforeEach(() => {
    input = makeInput()
  })

  it('should call PostRepository.loadById with correct value', async () => {
    const { sut, postRepositoryMock } = makeSut()
    await sut.execute(input)
    expect(postRepositoryMock.loadById).toHaveBeenCalledWith(input.postId)
  })

  it('should throw a PostNotFoundError if post is not found', async () => {
    const { sut, postRepositoryMock } = makeSut()
    postRepositoryMock.loadById.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    expect(promise).rejects.toThrow(new PostErrors.PostNotFound())
  })

  it('should return post on success', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(input)
    expect(result.post).toBeDefined()
  })
})
