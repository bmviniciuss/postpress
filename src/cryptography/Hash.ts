export interface HashComparer {
  compare(plainText: string, digest: string): Promise<boolean>
}

export interface Hasher {
  hash(plainText: string): Promise<string>
}
