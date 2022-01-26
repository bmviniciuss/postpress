import { SALT_NUMBER } from '../../../config/env'
import { BcryptAdapter } from '../../../infra/adapters/cryptography/BcryptAdapter'

export const makeBcrytAdapter = (salt = SALT_NUMBER) => {
  return new BcryptAdapter(salt)
}
