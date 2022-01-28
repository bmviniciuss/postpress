export namespace PostErrors {
  export class PostNotFound extends Error {
    constructor () {
      super('Post não existe')
      this.name = 'PostErrors.PostNotFound'
    }
  }
}
