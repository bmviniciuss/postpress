export namespace DeletePostErrors {
  export class UnauthorizedToDeletePostError extends Error {
    constructor () {
      super('Usuário não autorizado')
      this.name = 'DeletePostError.UnauthorizedToDeletePostError'
    }
  }
}
