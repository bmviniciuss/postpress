import faker from 'faker'
import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../tests/factories/userFactory'
import { JWT } from '../../../../cryptography/Jwt'
import { UserRepository } from '../../../../modules/user/repos/UserRepository'
import { AppErrors } from '../../../errors/AppErrors'
import { ok, unauthorized } from '../http'
import { AuthMidddleware, AuthMidddlewareRequest } from './AuthMiddleware'

function makeSut () {
  const jwtMock = mock<JWT>()
  const userRepositoryMock = mock<UserRepository>()

  const jwtPayloadMock = { sub: faker.datatype.uuid() }
  const authenticatedUser = userFactory(1)

  // golden path mock
  jwtMock.decrypt.mockResolvedValue(jwtPayloadMock)
  userRepositoryMock.loadUserFromTokenAndId.mockResolvedValue(authenticatedUser)

  const sut = new AuthMidddleware(jwtMock, userRepositoryMock)
  return { sut, jwtMock, jwtPayloadMock, userRepositoryMock, authenticatedUser }
}

const makeParams = (): AuthMidddlewareRequest => ({
  accessToken: `Bearer ${faker.datatype.uuid()}`
})

const getToken = (authorizationHeader = '') => {
  if (!authorizationHeader) return null
  const header = authorizationHeader.split('Bearer')
  if (!header[1]) return null
  return header[1].trim()
}

describe('AuthMiddleware', () => {
  let params: AuthMidddlewareRequest

  beforeEach(() => {
    params = makeParams()
  })

  it('should return unauthorized with TokenNotFoundError if no access token is provided', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({})
    expect(result).toEqual(unauthorized(new AppErrors.TokenNotFoundError()))
  })

  it('should return unauthorized with TokenNotFoundErrorif token does not have Bearer', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({ accessToken: faker.datatype.uuid() })
    expect(result).toEqual(unauthorized(new AppErrors.TokenNotFoundError()))
  })

  it('should call Jwt.decrypt with correct value', async () => {
    const { sut, jwtMock } = makeSut()
    await sut.handle(params)
    expect(jwtMock.decrypt).toHaveBeenCalledWith(getToken(params.accessToken))
  })

  it('should return unauthorized with ExpiredOrInvalidTokenError if Jwt.decrypt resolves null', async () => {
    const { sut, jwtMock } = makeSut()
    jwtMock.decrypt.mockResolvedValueOnce(null)
    const result = await sut.handle(params)
    expect(result).toEqual(unauthorized(new AppErrors.ExpiredOrInvalidTokenError()))
  })

  it('should call UserRepository.loadUserFromTokenAndId with correct value', async () => {
    const { sut, userRepositoryMock, jwtPayloadMock } = makeSut()
    await sut.handle(params)
    expect(userRepositoryMock.loadUserFromTokenAndId).toHaveBeenCalledWith(jwtPayloadMock.sub, getToken(params.accessToken))
  })

  it('should return unauthorized with ExpiredOrInvalidTokenError if UserRepository.loadUserFromTokenAndId returns null', async () => {
    const { sut, userRepositoryMock } = makeSut()
    userRepositoryMock.loadUserFromTokenAndId.mockResolvedValueOnce(null)
    const result = await sut.handle(params)
    expect(result).toEqual(unauthorized(new AppErrors.ExpiredOrInvalidTokenError()))
  })

  it('should return ok iwht authenticatedUser on success', async () => {
    const { sut, authenticatedUser } = makeSut()
    const result = await sut.handle(params)
    expect(result).toEqual(ok({ authenticatedUser }))
  })
})
