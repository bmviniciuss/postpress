export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error
})

export const serverError = (error: unknown): HttpResponse<Error | undefined> => ({
  statusCode: 500,
  data: error instanceof Error ? error : undefined
})

export const ok = <T = any> (data: T): HttpResponse<T> => ({
  statusCode: 200,
  data
})

export const created = <T = any> (data: T): HttpResponse<T> => ({
  statusCode: 201,
  data
})
