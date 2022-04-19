import Joi from 'joi';

const getCategoriesSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').optional()
})

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
  getCategoriesSchema, categorySchema, addCategorySchema, updateCategorySchema
}