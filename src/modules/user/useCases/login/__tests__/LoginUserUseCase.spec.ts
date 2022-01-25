import faker from 'faker'
import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../../tests/factories/userFactory'
import { HashComparer } from '../../../../../cryptography/Hash'
import { JWT } from '../../../../../cryptography/Jwt'
import { UserRepository } from '../../../repos/UserRepository'
import { LoginUserDTO } from '../LoginUse'
import { LoginUserErrors } from '../LoginUserErrors'
import { LoginUserUseCase } from '../LoginUserUseCase'

const makeSut = () => {
  const jwtMock = mock<JWT>()
  const hashComparerMock = mock<HashComparer>()
  const userRepositoryMock = mock<UserRepository>()

  // fake data
  const userFromLoadByEmail = userFactory(1)
  const fakeJwt = faker.datatype.uuid()

  // golden path mocks
  userRepositoryMock.loadByEmail.mockResolvedValue(userFromLoadByEmail)
  hashComparerMock.compare.mockResolvedValue(true)
  jwtMock.encrypt.mockResolvedValue(fakeJwt)

  const sut = new LoginUserUseCase(
    userRepositoryMock,
    hashComparerMock,
    jwtMock
  )

  return {
    sut,
    userRepositoryMock,
    userFromLoadByEmail,
    hashComparerMock,
    jwtMock,
    fakeJwt
  }
}

const makeParams = (): LoginUserDTO => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

describe('LoginUserUseCase', () => {
  let params: LoginUserDTO

  beforeEach(() => {
    params = makeParams()
  })

  it('should call UserRepository.loadbyEmail with correct params', async () => {
    const { sut, userRepositoryMock } = makeSut()
    await sut.execute(params)
    expect(userRepositoryMock.loadByEmail).toHaveBeenCalledWith(params.email)
  })

  it('should throw a UserNotFound UserRepository.loadbyEmail does not find a user', async () => {
    const { sut, userRepositoryMock } = makeSut()
    userRepositoryMock.loadByEmail.mockResolvedValueOnce(null)
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(new LoginUserErrors.UserNotFound())
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerMock, userFromLoadByEmail } = makeSut()
    await sut.execute(params)
    expect(hashComparerMock.compare).toHaveBeenCalledWith(params.password, userFromLoadByEmail.password)
  })

  it('should throw a EmailOrPasswordDoesNotMatch HashComparer.compare returns false', async () => {
    const { sut, hashComparerMock } = makeSut()
    hashComparerMock.compare.mockResolvedValueOnce(false)
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(new LoginUserErrors.EmailOrPasswordDoesNotMatch())
  })

  it('should call JWT.encrypt with user id', async () => {
    const { sut, userFromLoadByEmail, jwtMock } = makeSut()
    await sut.execute(params)
    expect(jwtMock.encrypt).toHaveBeenCalledWith(userFromLoadByEmail.id)
  })

  it('should throw if JWT.encrypt throws', async () => {
    const { sut, hashComparerMock } = makeSut()
    hashComparerMock.compare.mockImplementationOnce(() => { throw new Error() })
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(new Error())
  })

  it('should call UserRepository.setAccessToken with correct values', async () => {
    const { sut, userRepositoryMock, userFromLoadByEmail, fakeJwt } = makeSut()
    await sut.execute(params)
    expect(userRepositoryMock.setAccessToken).toHaveBeenCalledWith(userFromLoadByEmail.id, fakeJwt)
  })

  it('should throw if UserRepository.setAccessToken throws', async () => {
    const { sut, userRepositoryMock } = makeSut()
    userRepositoryMock.setAccessToken.mockImplementationOnce(() => { throw new Error() })
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(new Error())
  })

  it('should return jwt on success', async () => {
    const { sut, fakeJwt } = makeSut()
    const result = await sut.execute(params)
    expect(result).toEqual({ token: fakeJwt })
  })
})
