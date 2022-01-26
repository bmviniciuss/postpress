export interface JWT {
  encrypt(plaintext: string): Promise<string>
  decrypt: (token: string) => Promise<any>
}
