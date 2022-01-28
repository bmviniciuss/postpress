import faker from 'faker'
import { mock } from 'jest-mock-extended'

import postWithUserFactory from '../../../../../../tests/factories/postWithUserFactory'
import presentationUserFactory from '../../../../../../tests/factories/presentationUserFactory'
import userFactory from '../../../../../../tests/factories/userFactory'
import { PostRepository } from '../../../repos/PostRepository'
import { PostErrors } from '../../../shared/PostErrors'
import { UpdatePostInputDTO } from '../UpdatePost'
import { UpdatePostError } from '../UpdatePostErrors'
import { UpdatePostUseCase } from '../UpdatePostUseCase'

const makeSut = (userIdFromInput ?: string) => {
  const postRepositoryMock = mock<PostRepository>()

  const updatedPost = postWithUserFactory(1)

  // golden path mock
  postRepositoryMock.loadById.mockResolvedValue(postWithUserFactory(1, {
    user: presentationUserFactory(1, {
      id: userIdFromInput || faker.datatype.uuid()
    })
  }))

  postRepositoryMock.update.mockResolvedValue(updatedPost)

  const sut = new UpdatePostUseCase(postRepositoryMock)

  return {
    sut,
    postRepositoryMock,
    updatedPost
  }
}

const makeInput = (): UpdatePostInputDTO => ({
  title: faker.random.words(),
  content: faker.random.words(),
  postId: faker.datatype.uuid(),
  userPerformingOperation: userFactory(1)
})

describe('UpdatePostUseCase', () => {
  let input: UpdatePostInputDTO
  let userId: string

  beforeEach(() => {
    input = makeInput()
    userId = input.userPerformingOperation.id
  })

  it('should call PostRepository.loadById with correct value', async () => {
    const { sut, postRepositoryMock } = makeSut(userId)
    await sut.execute(input)
    expect(postRepositoryMock.loadById).toHaveBeenCalledWith(input.postId)
  })

  it('should throw a PostNotFound if loadById returns null', async () => {
    const { sut, postRepositoryMock } = makeSut(userId)
    postRepositoryMock.loadById.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new PostErrors.PostNotFound())
  })

  it('should return a UnauthorizedToUpdatePostError if user is not the post author', async () => {
    const { sut } = makeSut()
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new UpdatePostError.UnauthorizedToUpdatePostError())
  })

  it('should call PostRepository.update with correct values', async () => {
    const { sut, postRepositoryMock } = makeSut(userId)
    await sut.execute(input)
    expect(postRepositoryMock.update).toHaveBeenCalledWith({
      title: input.title,
      content: input.content
    })
  })

  it('should return updatePost on success', async () => {
    const { sut, updatedPost } = makeSut(userId)
    const result = await sut.execute(input)
    expect(result).toEqual(updatedPost)
  })
})
