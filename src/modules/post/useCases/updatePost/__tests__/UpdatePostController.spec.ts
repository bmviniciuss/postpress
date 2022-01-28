import faker from 'faker'
import { mock } from 'jest-mock-extended'

import presentationPostFactory from '../../../../../../tests/factories/presentationPostFactory'
import userFactory from '../../../../../../tests/factories/userFactory'
import { badRequest, notFound, ok, serverError } from '../../../../../shared/infra/http/http'
import { Validator } from '../../../../../validation/Validator'
import { PostErrors } from '../../../shared/PostErrors'
import { UpdatePost } from '../UpdatePost'
import { UpdatePostController, UpdatePostControllerRequest } from '../UpdatePostController'
import { UpdatePostError } from '../UpdatePostErrors'

const makeSut = () => {
  const validatorMock = mock<Validator>()
  const updatePost = mock<UpdatePost>()

  const updatedPost = presentationPostFactory(1)

  // golden path mock
  validatorMock.validate.mockReturnValue(null)
  updatePost.execute.mockResolvedValue(updatedPost)

  const sut = new UpdatePostController(
    validatorMock,
    updatePost
  )

  return {
    sut,
    validatorMock,
    updatePost,
    updatedPost
  }
}

const makeRequest = (): UpdatePostControllerRequest => ({
  authenticatedUser: userFactory(1),
  body: {
    title: faker.random.words(),
    content: faker.random.words()
  },
  params: {
    postId: faker.datatype.uuid()
  }
})

describe('UpdatePostController', () => {
  let request: UpdatePostControllerRequest

  beforeEach(() => {
    request = makeRequest()
  })

  it('should call Validator with correct values', async () => {
    const { sut, validatorMock } = makeSut()
    await sut.execute(request)
    expect(validatorMock.validate).toHaveBeenCalledWith(request.body)
  })

  it('should return a badRequest with validation error if Validator returns an error', async () => {
    const { sut, validatorMock } = makeSut()
    validatorMock.validate.mockReturnValueOnce(new Error())
    const response = await sut.execute(request)
    expect(response).toEqual(badRequest(new Error()))
  })

  it('should return a serverError if Validator throws', async () => {
    const { sut, validatorMock } = makeSut()
    validatorMock.validate.mockImplementationOnce(() => { throw new Error() })
    const response = await sut.execute(request)
    expect(response).toEqual(serverError(new Error()))
  })

  it('should call UpdatePost with correct values', async () => {
    const { sut, updatePost } = makeSut()
    await sut.execute(request)
    expect(updatePost.execute).toHaveBeenCalledWith({
      title: request.body?.title,
      content: request.body?.content,
      postId: request.params!.postId,
      userPerformingOperation: request.authenticatedUser
    })
  })

  it('should return a badRequest with UnauthorizedToUpdatePostError if UpdatePost throws a UnauthorizedToUpdatePostError', async () => {
    const { sut, updatePost } = makeSut()
    updatePost.execute.mockRejectedValueOnce(new UpdatePostError.UnauthorizedToUpdatePostError())
    const response = await sut.execute(request)
    expect(response).toEqual(badRequest(new UpdatePostError.UnauthorizedToUpdatePostError()))
  })

  it('should return a notFound if UpdatePost throws a PostNotFoundError', async () => {
    const { sut, updatePost } = makeSut()
    updatePost.execute.mockRejectedValueOnce(new PostErrors.PostNotFound())
    const response = await sut.execute(request)
    expect(response).toEqual(notFound(new PostErrors.PostNotFound()))
  })

  it('should a serverError if UpdatePost throws a unkown error', async () => {
    const { sut, updatePost } = makeSut()
    updatePost.execute.mockRejectedValueOnce(new Error())
    const response = await sut.execute(request)
    expect(response).toEqual(serverError(new Error()))
  })

  it('should return ok with with PresentationUpdatedPost', async () => {
    const { sut, updatedPost } = makeSut()
    const response = await sut.execute(request)
    expect(response).toEqual(ok({
      title: updatedPost.title,
      content: updatedPost.content,
      userId: updatedPost.user.id
    }))
  })
})
