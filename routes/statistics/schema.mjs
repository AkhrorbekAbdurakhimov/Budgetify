import baseJoi from 'joi';
import joiDate from '@joi/date';
const Joi = baseJoi.extend(joiDate);

const statisticsSchema = Joi.object({
  accountId: Joi.number().required()
});

export {
  statisticsSchema
}