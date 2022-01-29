import faker from 'faker'
import { mock } from 'jest-mock-extended'

import postWithUserFactory from '../../../../../../tests/factories/postWithUserFactory'
import { PostMapper } from '../../../models/mapper/PostMapper'
import { PostRepository } from '../../../repos/PostRepository'
import { PostSearchInputDTO } from '../PostSearch'
import { PostSearchUseCase } from '../PostSearchUseCase'

const makeSut = () => {
  const postRepositoryMock = mock<PostRepository>()

  // golden path mock
  const posts = postWithUserFactory(2)
  postRepositoryMock.findBySearch.mockResolvedValue(posts)

  const sut = new PostSearchUseCase(postRepositoryMock)

  return { sut, postRepositoryMock, posts }
}

const makeInput = (): PostSearchInputDTO => ({
  searchTerm: faker.random.words()
})

describe('PostSearchUseCase', () => {
  let input: PostSearchInputDTO

  beforeEach(() => {
    input = makeInput()
  })

  it('should call PostRepository.findBySearch with correct values', async () => {
    const { sut, postRepositoryMock } = makeSut()
    await sut.execute(input)
    expect(postRepositoryMock.findBySearch).toHaveBeenCalledWith({
      searchTerm: input.searchTerm
    })
  })

  it('should return mapped posts on sucess', async () => {
    const { sut, posts } = makeSut()
    const result = await sut.execute(input)
    expect(result.posts).toEqual(PostMapper.toPresentations(posts))
  })
})
