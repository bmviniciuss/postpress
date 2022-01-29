import bcrypt from 'bcrypt'

import { BcryptAdapter } from '../BcryptAdapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise((resolve) => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  }
}))

const makeSut = (salt = 10) => {
  const sut = new BcryptAdapter(salt)

  return {
    sut,
    salt
  }
}

describe('Bcrypt Adapter', () => {
  it('Should call hash with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a valid hash on hash success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toEqual('hash')
  })

  it('Should throw if hash throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.reject(new Error()))
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  it('Should compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  it('Should return true if compare succeeds', async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBeTruthy()
  })

  it('Should return false if compare fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false))
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBeFalsy()
  })

  it('Should throw if compare throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.reject(new Error()))
    const promise = sut.compare('any_value', 'any_hash')
    await expect(promise).rejects.toThrow()
  })
})
