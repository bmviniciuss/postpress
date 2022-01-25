import bcrypt from 'bcrypt'

import { HashComparer } from '../../../cryptography/Hash'

export class BcryptAdapter implements HashComparer {
  async compare (plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
  }
}
