import { Post } from '@prisma/client'
import factoryMaker, { DeepPartial } from 'factory-maker'
import faker from 'faker'

function makePost (options?: DeepPartial<Post>):Post {
  const basePost: Post = {
    id: faker.datatype.uuid(),
    title: faker.random.words(),
    content: faker.random.words(),
    userId: faker.datatype.uuid(),
    published: new Date(),
    updated: new Date()
  }
  return Object.assign({}, basePost, options)
}

export default factoryMaker<Post>(makePost)
