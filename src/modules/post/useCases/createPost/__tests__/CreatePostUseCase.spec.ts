import faker from 'faker'
import { mock } from 'jest-mock-extended'

import postWithUserFactory from '../../../../../../tests/factories/postWithUserFactory'
import userFactory from '../../../../../../tests/factories/userFactory'
import { PostMapper } from '../../../models/mapper/PostMapper'
import { PostRepository } from '../../../repos/PostRepository'
import { CreatePostInputDTO } from '../CreatePost'
import { CreatePostUseCase } from '../CreatePostUseCase'

const makeSut = () => {
  const postRepositoryMock = mock<PostRepository>()

  const createdPost = postWithUserFactory(1)

  // golden path mock
  postRepositoryMock.create.mockResolvedValue(createdPost)

  const sut = new CreatePostUseCase(postRepositoryMock)

  return {
    sut,
    postRepositoryMock,
    createdPost
  }
}

const makeInput = (): CreatePostInputDTO => ({
  title: faker.random.words(),
  content: faker.random.words(),
  user: userFactory(1)
})

describe('CreatePostUseCase', () => {
  let input: CreatePostInputDTO

  beforeEach(() => {
    input = makeInput()
  })

  it('should call PostRepository.create with correct values', async () => {
    const { sut, postRepositoryMock } = makeSut()
    await sut.execute(input)
    expect(postRepositoryMock.create).toHaveBeenCalledWith({
      title: input.title,
      content: input.content,
      userId: input.user.id
    })
  })

  it('should return a presenationPost', async () => {
    const { sut, createdPost } = makeSut()
    const result = await sut.execute(input)
    expect(result).toEqual(PostMapper.toPresentation(createdPost))
  })
})
