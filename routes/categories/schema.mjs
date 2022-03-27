import Joi from 'joi';

const categorySchema = Joi.object({
  id: Joi.number().required()
})

const addCategorySchema = Joi.object({
  title: Joi.string().required(),
  type: Joi.string().valid('income', 'expense').required(),
})

const updateCategorySchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required()
})

export {
  categorySchema, addCategorySchema, updateCategorySchema
}