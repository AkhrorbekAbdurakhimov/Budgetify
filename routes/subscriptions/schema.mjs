import baseJoi from 'joi';
import joiDate from '@joi/date';
const Joi = baseJoi.extend(joiDate);

const addSubscriptionSchema = Joi.object({
  title: Joi.string().min(3).required(),
  amount: Joi.number().required(),
  accountId: Joi.number().required(),
  initialDate: Joi.date().format('DD.MM.YYYY'),
  description: Joi.string().optional(),
  lastDate: Joi.date().format('DD.MM.YYYY'),
})

export {
  addSubscriptionSchema
}