import faker from 'faker'
import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../tests/factories/userFactory'
import { badRequest, conflict, created } from '../../../../shared/infra/http/http'
import { Validator } from '../../../../validation/Validator'
import { LoginUser } from '../login/LoginUse'
import { RegisterUser } from './RegisterUser'
import { RegisterUserController, RegisterUserControllerRequestDTO } from './RegisterUserController'
import { RegisterUserErrors } from './RegisterUserErrors'

const makeSut = () => {
  const validatorMock = mock<Validator>()
  const registerUserMock = mock<RegisterUser>()
  const loginUserMock = mock<LoginUser>()

  const registeredUser = userFactory(1)
  const accessToken = faker.datatype.uuid()

  // golden path mocks
  validatorMock.validate.mockReturnValue(null)
  registerUserMock.execute.mockResolvedValue({ user: registeredUser })
  loginUserMock.execute.mockResolvedValue({ token: accessToken })

  const sut = new RegisterUserController(
    validatorMock,
    registerUserMock,
    loginUserMock
  )

  return {
    sut,
    validatorMock,
    registerUserMock,
    loginUserMock,
    registeredUser,
    accessToken
  }
}

const makeParams = (): RegisterUserControllerRequestDTO => ({
  email: faker.internet.email(),
  password: faker.internet.password(7),
  displayName: faker.name.findName(),
  image: faker.internet.url()
})

describe('RegisterUserController', () => {
  let params: RegisterUserControllerRequestDTO

  beforeEach(() => {
    params = makeParams()
  })

  it('should call Validator with correct params', async () => {
    const { sut, validatorMock } = makeSut()
    await sut.execute(params)
    expect(validatorMock.validate).toHaveBeenCalledWith(params)
  })

  it('should return a badRequest if Validator returns an error', async () => {
    const { sut, validatorMock } = makeSut()
    validatorMock.validate.mockReturnValueOnce(new Error())
    const response = await sut.execute(params)
    expect(response).toEqual(badRequest(new Error()))
  })

  it('should call RegisterUser with correct values', async () => {
    const { sut, registerUserMock } = makeSut()
    await sut.execute(params)
    expect(registerUserMock.execute).toHaveBeenCalledWith(params)
  })

  it('should return a conflict response if RegisterUser throws a EmailAlreadyInUseError', async () => {
    const { sut, registerUserMock } = makeSut()
    registerUserMock.execute.mockRejectedValueOnce(new RegisterUserErrors.EmailAlreadyInUseError())
    const result = await sut.execute(params)
    expect(result).toEqual(conflict(new RegisterUserErrors.EmailAlreadyInUseError()))
  })

  it('should call LoginUser with User email and password', async () => {
    const { sut, registeredUser, loginUserMock } = makeSut()
    await sut.execute(params)
    expect(loginUserMock.execute).toHaveBeenCalledWith({
      email: registeredUser.email,
      password: params.password
    })
  })

  it('should return created with token on success', async () => {
    const { sut, accessToken } = makeSut()
    const result = await sut.execute(params)
    expect(result).toEqual(created({
      token: accessToken
    }))
  })
})
