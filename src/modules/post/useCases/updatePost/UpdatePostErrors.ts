export namespace UpdatePostError {
  export class UnauthorizedToUpdatePostError extends Error {
    constructor () {
      super('Usuário não autorizado')
      this.name = 'UpdatePostError.UnauthorizedToUpdatePostError'
    }
  }
}
