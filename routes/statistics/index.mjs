import moment from "moment";
import express from "express";

import { catchReject } from "./../../utils/helper.mjs";
import { statisticsSchema } from "./schema.mjs";
import Statistics from "./../../database/statistics.mjs";

const router = express.Router();

const getStatisitcs = catchReject(async (req, res, next) => {
  const { error, value } = statisticsSchema.validate(req.params);
  
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
    
  const statistics = await Statistics.getStatisitcs(value.accountId);
  return res.status(200).send({
    statistics
  })
})

router.get('/:accountId', getStatisitcs);

export default router;