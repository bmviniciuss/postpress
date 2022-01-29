import faker from 'faker'
import { mock } from 'jest-mock-extended'

import postWithUserFactory from '../../../../../../tests/factories/postWithUserFactory'
import presentationUserFactory from '../../../../../../tests/factories/presentationUserFactory'
import userFactory from '../../../../../../tests/factories/userFactory'
import { PostRepository } from '../../../repos/PostRepository'
import { PostErrors } from '../../../shared/PostErrors'
import { DeletePostInputDTO } from '../DeletePost'
import { DeletePostErrors } from '../DeletePostErrors'
import { DeletePostUseCase } from '../DeletePostUseCase'

const makeSut = (userId?: string) => {
  const postRepositoryMock = mock<PostRepository>()

  // golden path mock
  postRepositoryMock.loadById.mockResolvedValue(
    postWithUserFactory(1, {
      user: presentationUserFactory(1, {
        id: userId || faker.datatype.uuid()
      })
    })
  )

  const sut = new DeletePostUseCase(postRepositoryMock)

  return {
    sut,
    postRepositoryMock
  }
}

const makeInput = ():DeletePostInputDTO => ({
  postId: faker.datatype.uuid(),
  userPerformingOperation: userFactory(1)
})

describe('DeletePostUseCase', () => {
  let input:DeletePostInputDTO
  let userId: string

  beforeEach(() => {
    input = makeInput()
    userId = input.userPerformingOperation.id
  })

  it('should call PostRepository.loadByid with correct value', async () => {
    const { sut, postRepositoryMock } = makeSut(userId)
    await sut.execute(input)
    expect(postRepositoryMock.loadById).toHaveBeenCalledWith(input.postId)
  })

  it('should throw a PostNotFound error if post is not found', async () => {
    const { sut, postRepositoryMock } = makeSut()
    postRepositoryMock.loadById.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new PostErrors.PostNotFound())
  })

  it('should throw a UnauthorizedToDeletePostError if user is not the post author', async () => {
    const { sut } = makeSut(faker.datatype.uuid())
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrow(new DeletePostErrors.UnauthorizedToDeletePostError())
  })

  it('should call PostRepository.deletePostById with correct value', async () => {
    const { sut, postRepositoryMock } = makeSut(userId)
    await sut.execute(input)
    expect(postRepositoryMock.deletePostById).toHaveBeenCalledWith(input.postId)
  })
})
