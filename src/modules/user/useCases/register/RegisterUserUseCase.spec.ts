import faker from 'faker'
import { mock } from 'jest-mock-extended'

import userFactory from '../../../../../tests/factories/userFactory'
import { Hasher } from '../../../../cryptography/Hash'
import { UserRepository } from '../../repos/UserRepository'
import { RegisterUserDTO } from './RegisterUser'
import { RegisterUserErrors } from './RegisterUserErrors'
import { RegisterUserUseCase } from './RegisterUserUseCase'

const makeSut = () => {
  const userRepositoryMock = mock<UserRepository>()
  const hasherMock = mock<Hasher>()
  const sut = new RegisterUserUseCase(
    userRepositoryMock,
    hasherMock
  )

  const hash = faker.datatype.uuid()
  const createdUser = userFactory(1)

  // golden path mocks
  userRepositoryMock.loadByEmail.mockResolvedValue(null)
  hasherMock.hash.mockResolvedValue(hash)
  userRepositoryMock.register.mockResolvedValueOnce(createdUser)

  return {
    sut,
    userRepositoryMock,
    hasherMock,
    hash,
    createdUser
  }
}

const makeParams = (): RegisterUserDTO => ({
  email: faker.internet.email(),
  password: faker.internet.password(7),
  displayName: faker.name.findName(),
  image: faker.internet.url()
})

describe('RegisterUserUseCase', () => {
  let params: RegisterUserDTO

  beforeEach(() => {
    params = makeParams()
  })

  it('should call UserRepository.loadByEmail with correct params', async () => {
    const { sut, userRepositoryMock } = makeSut()
    await sut.execute(params)
    expect(userRepositoryMock.loadByEmail).toHaveBeenCalledWith(params.email)
  })

  it('should throw a RegisterUserErrors.EmailAlreadyInUseError if user already exists', async () => {
    const { sut, userRepositoryMock } = makeSut()
    userRepositoryMock.loadByEmail.mockResolvedValueOnce(userFactory(1))
    await expect(sut.execute(params)).rejects.toThrow(new RegisterUserErrors.EmailAlreadyInUseError())
  })

  it('should call Hasher with provided password', async () => {
    const { sut, hasherMock } = makeSut()
    await sut.execute(params)
    expect(hasherMock.hash).toHaveBeenCalledWith(params.password)
  })

  it('should call UserRepository.register with correct params', async () => {
    const { sut, userRepositoryMock, hash } = makeSut()
    await sut.execute(params)
    expect(userRepositoryMock.register).toHaveBeenCalledWith({
      ...params,
      password: hash
    })
  })

  it('should return created user on sucess', async () => {
    const { sut, createdUser } = makeSut()
    const result = await sut.execute(params)

    expect(result.user.id).toEqual(createdUser.id)
    expect(result.user.email).toEqual(createdUser.email)
  })
})
