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

  export class UnauthorizedError extends Error {
    constructor () {
      super('Unauthorized')
      this.name = 'AppErrors.UnauthorizedError'
    }
  }

  export class TokenNotFoundError extends Error {
    constructor () {
      super('Token não encontrado')
      this.name = 'AppErrors.TokenNotFound'
    }
  }

  export class ExpiredOrInvalidTokenError extends Error {
    constructor () {
      super('Token expirado ou inválido')
      this.name = 'AppErrors.ExpiredOrInvalidTokenError'
    }
  }
}
