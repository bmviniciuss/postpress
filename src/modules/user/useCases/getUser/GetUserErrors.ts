export namespace GetUserErrors {
  export class UserNotFound extends Error {
    constructor () {
      super('Usuário não existe')
      this.name = 'LoginUserErrors.UserNotFound'
    }
  }
}
