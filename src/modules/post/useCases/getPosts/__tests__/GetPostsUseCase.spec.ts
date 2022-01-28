import { mock } from 'jest-mock-extended'

import postWithUserFactory from '../../../../../../tests/factories/postWithUserFactory'
import { PostRepository } from '../../../repos/PostRepository'
import { GetPostsUseCase } from '../GetPostsUseCase'

const makeSut = () => {
  const postRepostioryMock = mock<PostRepository>()

  const posts = [postWithUserFactory(1)]

  // golden path mock
  postRepostioryMock.getAll.mockResolvedValue(posts)

  const sut = new GetPostsUseCase(postRepostioryMock)

  return {
    sut,
    postRepostioryMock,
    posts
  }
}

describe('GetPostsUseCase', () => {
  it('should call PostRepository.getAll', async () => {
    const { sut, postRepostioryMock } = makeSut()
    await sut.execute()
    expect(postRepostioryMock.getAll).toHaveBeenCalled()
  })

  it('should return PresentationPost', async () => {
    const { sut, posts } = makeSut()
    const result = await sut.execute()

    const [post] = posts
    expect(result.posts).toEqual([
      {
        id: post.id,
        published: post.published,
        updated: post.updated,
        title: post.title,
        content: post.content,
        user: {
          id: post.user.id,
          displayName: post.user.displayName,
          email: post.user.email,
          image: post.user.image
        }
      }
    ])
  })
})
