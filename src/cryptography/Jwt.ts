export interface JWT {
  encrypt(plaintext: string): Promise<string>
}
