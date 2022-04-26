import baseJoi from 'joi';
import joiDate from '@joi/date';
const Joi = baseJoi.extend(joiDate);

const transactionSchema = Joi.object({
  id: Joi.number().required()
});

const getTransactionsSchema = Joi.object({
  accountId: Joi.number().required(),
  type: Joi.string().valid('income', 'expense').allow(null),
  order: Joi.string().valid('asc', 'desc').default('desc')
})

const addTransactionSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  accountId: Joi.number().required(),
  type: Joi.string().valid('income', 'expense').required(),
  categoryIds: Joi.array().items(Joi.number()).required(),
  amount: Joi.number().required(),
  date: Joi.date().format('YYYY-MM-DD').required()
});

const updateTransactionSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  accountId: Joi.number().optional(),
  categoryId: Joi.number().optional(),
  amount: Joi.number().optional(),
  date: Joi.date().format('DD.MM.YYYY')
})

export {
  getTransactionsSchema, transactionSchema, addTransactionSchema, updateTransactionSchema
}