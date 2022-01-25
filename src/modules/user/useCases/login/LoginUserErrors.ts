export namespace LoginUserErrors {

  export class InvalidParamsError extends Error {
    constructor () {
      super('Campos inválidos')
      this.name = 'LoginUserErrors.InvalidParamsError'
    }
  }

  export class UserNotFound extends Error {
    constructor () {
      super('Usuário não encontrado')
      this.name = 'LoginUserErrors.UserNotFound'
    }
  }

  export class EmailOrPasswordDoesNotMatch extends Error {
    constructor () {
      super('Email ou senha estão inválidos')
      this.name = 'LoginUserErrors.EmailOrPasswordDoesNotMatch'
    }
  }
}
