import { JWT_SECRET } from '../../../config/env'
import { JwtAdapter } from '../../../infra/adapters/cryptography/JwtAdapter'

export const makeJwtAdapter = (secret = JWT_SECRET) => {
  return new JwtAdapter(JWT_SECRET)
}
