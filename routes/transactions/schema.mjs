import baseJoi from 'joi';
import joiDate from '@joi/date';
const Joi = baseJoi.extend(joiDate);

const transactionSchema = Joi.object({
  id: Joi.number().required()
});

const addTransactionSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  accountId: Joi.number().required(),
  type: Joi.string().valid('income', 'expense').required(),
  categoryId: Joi.number().required(),
  amount: Joi.number().required(),
  date: Joi.date().format('DD.MM.YYYY')
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
  transactionSchema, addTransactionSchema, updateTransactionSchema
}