import Joi from 'joi'

import { ValidationError } from '../../../validation/ValidationError'
import { Validator } from '../../../validation/Validator'

export class JoiValidatorAdapter implements Validator {
  constructor (private readonly schema: Joi.ObjectSchema) {}

  validate (input: any): Error | null {
    const validation = this.schema.validate(input)
    if (validation.error) {
      return new ValidationError(validation.error.message)
    }
    return null
  }
}
