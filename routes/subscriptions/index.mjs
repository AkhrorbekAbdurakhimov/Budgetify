import moment from "moment";
import express from "express";
import { addSubscriptionSchema } from "./schema.mjs";
import { catchReject } from "./../../utils/helper.mjs";
import Accounts from "./../../database/accounts.mjs";
import Transactions from "./../../database/transactions.mjs";
import Subscriptions from "./../../database/subscriptions.mjs";

const router = express.Router();

const getSubscriptions = catchReject(async (req, res, next) => {
  const subscriptions = await Subscriptions.getSubscriptions();
  res.status(200).send({
    subscriptions
  })
})

const addSubscription = catchReject(async (req, res, next) => {
  const { error, value } = addSubscriptionSchema.validate(req.body);
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
  value.initialDate = value.initialDate ? moment(value.initialDate).format('YYYY-MM-DD') : value.initialDate;
  value.lastDate = value.lastDate ? moment(value.lastDate).format('YYYY-MM-DD') : value.lastDate;
  try {
    await Transactions.beginTransaction();
    const balanceResult = await Accounts.GetEstimateBalance('expense', value.amount, value.accountId);
    if (balanceResult[0].balance < 0) {
      return res.status(200).send({
        message: 'You have not enough money for create subscription'
      })
    }
    const result = await Subscriptions.addSubscription(value);
    await Accounts.updateAccountBalance('expense', value.amount, value.accountId);
    await Transactions.commitTransaction();
    res.status(201).send({
      message: "Subscription created successfully",
      account: result[0]
    })
  } catch (err) {
    console.log(err);
    await Transactions.rollbackTransaction();
    if (err.code == '23505') {
      res.status(209).send({
        message: "Subscription title must be unique"
      })
    } else {
      res.status(500).send({
        message: "Internal server error"
      })
    }
  }
})

router.get('/', getSubscriptions);
router.post('/', addSubscription);

export default router;