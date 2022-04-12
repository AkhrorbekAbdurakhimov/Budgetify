import express from "express";

import { catchReject } from "./../../utils/helper.mjs";
import Currencies from "./../../database/currencies.mjs";

const router = express.Router();

const getCurrencies = catchReject(async (req, res, next) => {
  const currencies = await Currencies.getCurrencies(req.user.country_id);
  res.status(200).send({
    currencies
  })
})

router.get('/', getCurrencies);

export default router;