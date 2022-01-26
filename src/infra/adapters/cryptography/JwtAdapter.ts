import jwt from 'jsonwebtoken'

import { JWT } from '../../../cryptography/Jwt'

export class JwtAdapter implements JWT {
  constructor (private readonly secret: string) {}

  async encrypt (plaintext: string): Promise<string> {
    const token = jwt.sign({ sub: plaintext }, this.secret)
    return Promise.resolve(token)
  }

  decrypt (token: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err) return resolve(null)
        return resolve(decoded)
      })
    })
  }
}
