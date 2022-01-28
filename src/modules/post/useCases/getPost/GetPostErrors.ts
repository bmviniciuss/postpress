export namespace GetPostErrors {
  export class PostNotFound extends Error {
    constructor () {
      super('Post não existe')
      this.name = 'GetPostErrors.PostNotFound'
    }
  }
}
