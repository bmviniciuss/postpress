export namespace RegisterUserErrors {

  export class InvalidParamsError extends Error {
    constructor () {
      super('Campos inválidos')
      this.name = 'RegisterUserErrors.InvalidParamsError'
    }
  }

  export class EmailAlreadyInUseError extends Error {
    constructor () {
      super('Usuário já existe')
      this.name = 'RegisterUserErrors.EmailAlreadyInUseError'
    }
  }
}
