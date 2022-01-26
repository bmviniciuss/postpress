import { User } from '@prisma/client'

export type PresentationUser = Pick<User, 'id' | 'displayName' | 'email' | 'image'>
