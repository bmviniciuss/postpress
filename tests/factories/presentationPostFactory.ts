import factoryMaker, { DeepPartial } from 'factory-maker'
import faker from 'faker'

import { PresentationPost } from '../../src/modules/post/models/PresentationPost'
import presentationUserFactory from './presentationUserFactory'

function makePresentationPost (options?: DeepPartial<PresentationPost>):PresentationPost {
  const baseUser: PresentationPost = {
    id: faker.datatype.uuid(),
    title: faker.random.words(),
    content: faker.random.words(),
    user: presentationUserFactory(1),
    published: new Date(),
    updated: new Date()
  }
  return Object.assign({}, baseUser, options)
}

export default factoryMaker<PresentationPost>(makePresentationPost)
