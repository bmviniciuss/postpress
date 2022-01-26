import bcrypt from 'bcrypt'

import { HashComparer, Hasher } from '../../../cryptography/Hash'

export class BcryptAdapter implements HashComparer, Hasher {
  constructor (private readonly salt: number) {}

  async hash (plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.salt)
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
  }
}
