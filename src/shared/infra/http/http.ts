import { User } from '@prisma/client'

import { AppErrors } from '../../errors/AppErrors'

export interface HttpRequest<T = any, P = any> {
  body?: T
  params?:P
  authenticatedUser?: User
}

export interface HttpAuthenticatedRequest<T = any, P = any> {
  body?: T
  params?:P
  authenticatedUser: User
}

export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error
})

export const notFound = (error: Error): HttpResponse<Error> => ({
  statusCode: 404,
  data: error
})

export const serverError = (error: unknown): HttpResponse<Error | undefined> => ({
  statusCode: 500,
  data: error instanceof Error ? new AppErrors.InternalAppError(error.stack) : undefined
})

export const conflict = (error: Error): HttpResponse<Error> => ({
  statusCode: 409,
  data: error
})

export const ok = <T = any> (data: T): HttpResponse<T> => ({
  statusCode: 200,
  data
})

export const created = <T = any> (data: T): HttpResponse<T> => ({
  statusCode: 201,
  data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  data: null
})

export const unauthorized = (error ?: Error): HttpResponse => ({
  statusCode: 401,
  data: error || new AppErrors.UnauthorizedError()
})
