import baseJoi from 'joi';
import joiDate from '@joi/date';
const Joi = baseJoi.extend(joiDate);

const getSubscriptionsSchema = Joi.object({
  accountId: Joi.number().required()
})

const getSubscriptionSchema = Joi.object({
  subscriptionId: Joi.number().required()
})

const addSubscriptionSchema = Joi.object({
  title: Joi.string().min(3).required(),
  categories: Joi.array().items(Joi.string()),
  amount: Joi.number().required(),
  accountId: Joi.number().required(),
  initialDate: Joi.date().format('YYYY-MM-DD').required(),
  lastDate: Joi.date().format('YYYY-MM-DD').optional().allow(null),
  description: Joi.string().optional().allow(null),
})

export {
  addSubscriptionSchema,
  getSubscriptionSchema,
  getSubscriptionsSchema
}