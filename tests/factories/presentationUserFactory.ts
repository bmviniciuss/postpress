import factoryMaker, { DeepPartial } from 'factory-maker'
import faker from 'faker'

import { PresentationUser } from '../../src/modules/user/models/PresentationUser'

function makePresentationUser (options?: DeepPartial<PresentationUser>): PresentationUser {
  const baseUser: PresentationUser = {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    displayName: faker.name.findName(),
    image: faker.internet.url()
  }
  return Object.assign({}, baseUser, options)
}

export default factoryMaker<PresentationUser>(makePresentationUser)
