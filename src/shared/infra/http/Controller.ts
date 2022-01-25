import { HttpResponse } from './http'

export abstract class Controller {
  abstract execute(httpRequest: any): Promise<HttpResponse>

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      return await this.execute(httpRequest)
    } catch (error) {
      return this.serverError(error)
    }
  }

  public serverError (error: unknown): HttpResponse<Error> {
    return {
      statusCode: 500,
      data: error instanceof Error ? error : new Error()
    }
  }
}
