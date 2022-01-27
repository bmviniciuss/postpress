import factoryMaker, { DeepPartial } from 'factory-maker'
import faker from 'faker'

import { PostWithUser } from '../../src/modules/post/repos/PostRepository'
import userFactory from './userFactory'

function makePost (options?: DeepPartial<PostWithUser>):PostWithUser {
  const basePost: PostWithUser = {
    id: faker.datatype.uuid(),
    title: faker.random.words(),
    content: faker.random.words(),
    userId: faker.datatype.uuid(),
    user: userFactory(1),
    published: new Date(),
    updated: new Date()
  }
  return Object.assign({}, basePost, options)
}

export default factoryMaker<PostWithUser>(makePost)
