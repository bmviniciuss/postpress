import { User } from '@prisma/client'

export interface PresentationPost {
  id: string
  published: Date
  updated: Date
  title: string
  content: string
  user: Pick<User, 'id' | 'displayName' | 'email' | 'image'>
}
