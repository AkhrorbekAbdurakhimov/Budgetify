import Joi from 'joi';

const addAccountSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  currencyId: Joi.number().required(),
})

const accountSchema = Joi.object({
  id: Joi.number().required(),
})

const updateAccountSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  currency: Joi.string().optional(),
})

export {
  addAccountSchema, accountSchema, updateAccountSchema
}