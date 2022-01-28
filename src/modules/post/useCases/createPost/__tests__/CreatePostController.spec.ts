import faker from 'faker'
import { mock } from 'jest-mock-extended'

import presentationPostFactory from '../../../../../../tests/factories/presentationPostFactory'
import userFactory from '../../../../../../tests/factories/userFactory'
import { badRequest, created, serverError } from '../../../../../shared/infra/http/http'
import { Validator } from '../../../../../validation/Validator'
import { PresentationCreatedPost } from '../../../models/PresentationCreatedPost'
import { CreatePost } from '../CreatePost'
import { CreatePostController, CreatePostControllerRequest } from '../CreatePostController'

const makeSut = () => {
  const validatorMock = mock<Validator>()
  const createPostMock = mock<CreatePost>()

  const createdPost = presentationPostFactory(1)

  // golden path mock
  validatorMock.validate.mockReturnValue(null)
  createPostMock.execute.mockResolvedValue(createdPost)

  const sut = new CreatePostController(
    validatorMock,
    createPostMock
  )

  return {
    sut,
    validatorMock,
    createPostMock,
    createdPost
  }
}

const makeRequest = (): CreatePostControllerRequest => ({
  authenticatedUser: userFactory(1),
  body: {
    title: faker.random.words(),
    content: faker.random.words()
  }
})

describe('CreatePostController', () => {
  let request: CreatePostControllerRequest

  beforeEach(() => {
    request = makeRequest()
  })

  it('should call validation with correct params', async () => {
    const { sut, validatorMock } = makeSut()
    await sut.execute(request)
    expect(validatorMock.validate).toHaveBeenCalledWith(request.body)
  })

  it('should badRequest with Validator error', async () => {
    const { sut, validatorMock } = makeSut()
    const validatorError = new Error('any_field')
    validatorMock.validate.mockReturnValueOnce(validatorError)
    const result = await sut.execute(request)
    expect(result).toEqual(badRequest(validatorError))
  })

  it('should return server error if Validator throws', async () => {
    const { sut, validatorMock } = makeSut()
    validatorMock.validate.mockImplementationOnce(() => { throw new Error() })
    const result = await sut.execute(request)
    expect(result).toEqual(serverError(new Error()))
  })

  it('should call CreatePost with correct values', async () => {
    const { sut, createPostMock } = makeSut()
    await sut.execute(request)
    expect(createPostMock.execute).toHaveBeenCalledWith({
      title: request.body?.title,
      content: request.body?.content,
      user: request.authenticatedUser
    })
  })

  it('should return ok with PresentationCreatedPost on success', async () => {
    const { sut, createdPost } = makeSut()

    const result = await sut.execute(request)
    const expectedValue: PresentationCreatedPost = {
      content: createdPost.content,
      title: createdPost.title,
      userId: createdPost.user.id
    }
    expect(result).toEqual(created(expectedValue))
  })
})
