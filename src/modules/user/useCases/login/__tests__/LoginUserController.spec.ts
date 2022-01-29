import { mock } from 'jest-mock-extended'

import { badRequest, ok, serverError } from '../../../../../shared/infra/http/http'
import { Validator } from '../../../../../validation/Validator'
import { LoginUser } from '../LoginUser'
import { LoginUserController, LoginUserControllerRequest } from '../LoginUserController'
import { LoginUserErrors } from '../LoginUserErrors'

const makeSut = () => {
  const validatorMock = mock<Validator>()
  const loginUserUseCaseMock = mock<LoginUser>()

  // golden path mocks
  validatorMock.validate.mockReturnValue(null)
  const tokenFromLoginUseCaseMock = 'any_token'
  loginUserUseCaseMock.execute.mockResolvedValue({ token: tokenFromLoginUseCaseMock })

  const sut = new LoginUserController(validatorMock, loginUserUseCaseMock)
  return { sut, validatorMock, loginUserUseCaseMock, tokenFromLoginUseCaseMock }
}

const makeRequest = (): LoginUserControllerRequest => ({
  body: {
    email: 'any@any.com',
    password: '123456'
  }
})

describe('LoginController', () => {
  let request: LoginUserControllerRequest

  beforeEach(() => {
    request = makeRequest()
  })

  it('should call Validator with correct values', async () => {
    const { sut, validatorMock } = makeSut()
    await sut.execute(request)
    expect(validatorMock.validate).toHaveBeenCalledWith(request.body)
  })

  it('should return 400 if params is invalid', async () => {
    const { sut, validatorMock } = makeSut()
    validatorMock.validate.mockReturnValueOnce(new Error())
    const result = await sut.execute(request)
    expect(result).toEqual(badRequest(new Error()))
  })

  it('should return 500 if Validator throws', async () => {
    const { sut, validatorMock } = makeSut()
    validatorMock.validate.mockImplementationOnce(() => { throw new Error() })
    const result = await sut.execute(request)
    expect(result).toEqual(serverError(new Error()))
  })

  it('should call LoginUserUseCase with correct values', async () => {
    const { sut, loginUserUseCaseMock } = makeSut()
    await sut.execute(request)
    expect(loginUserUseCaseMock.execute).toHaveBeenCalledWith(request.body)
  })

  it('should return 200 with access token on LoginUserUseCase success', async () => {
    const { sut, tokenFromLoginUseCaseMock } = makeSut()
    const result = await sut.execute(request)
    expect(result).toEqual(ok({ token: tokenFromLoginUseCaseMock }))
  })

  it('should return 400 if LoginUserUseCase does not find a user', async () => {
    const { sut, loginUserUseCaseMock } = makeSut()
    loginUserUseCaseMock.execute.mockRejectedValueOnce(new LoginUserErrors.UserNotFound())
    const result = await sut.execute(request)
    expect(result).toEqual(badRequest(new LoginUserErrors.InvalidParamsError()))
  })

  it('should return 400 if LoginUserUseCase throws a EmailOrPasswordDoesNotMatch', async () => {
    const { sut, loginUserUseCaseMock } = makeSut()
    loginUserUseCaseMock.execute.mockRejectedValueOnce(new LoginUserErrors.EmailOrPasswordDoesNotMatch())
    const result = await sut.execute(request)
    expect(result).toEqual(badRequest(new LoginUserErrors.InvalidParamsError()))
  })

  it('should return 500 if LoginUserUseCase throws a unkown error', async () => {
    const { sut, loginUserUseCaseMock } = makeSut()
    loginUserUseCaseMock.execute.mockRejectedValueOnce(new Error())
    const result = await sut.execute(request)
    expect(result).toEqual(serverError(new Error()))
  })
})
