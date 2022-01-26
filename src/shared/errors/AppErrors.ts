export namespace AppErrors {
  export class InvalidParamsError extends Error {
    constructor () {
      super('Campos inválidos')
      this.name = 'AppErrors.InvalidParamsError'
    }
  }

  export class InternalAppError extends Error {
    constructor (stack?: string) {
      super('Error interno da aplicação')
      this.name = 'AppErrors.ServerError'
      this.stack = stack
    }
  }
}
