import express from "express";

import { catchReject } from "./../../utils/helper.mjs";
import { accountSchema, addAccountSchema, updateAccountSchema } from "./schema.mjs";

import Accounts from "./../../database/accounts.mjs";
import Currencies from "./../../database/currencies.mjs"
import Transactions from "./../../database/transactions.mjs"

const router = express.Router();

const getAccounts = catchReject(async (req, res, next) => {
  const accounts = await Accounts.getAllAccounts(req.user.id);
  let isFirst = true;
  accounts.map((account) => {
    if (account.currency === req.user.currency && isFirst) {
      account.isSelected = true;
      isFirst = false;
    }
    else account.isSelected = false;
  })
  return res.status(200).send({
    accounts
  })
})

const getAccount = catchReject(async (req, res, next) => {
  const { error, value } = accountSchema.validate(req.params);
  
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
    
  const result = await Accounts.getAccount(value);
  if (result.length) {
    return res.status(200).send({
      account: result[0]
    })
  } else {
    return res.status(404).send({
      message: 'This kind of account is not found'
    })
  }
})

const addAccount = catchReject(async (req, res, next) => {
  const { error, value } = addAccountSchema.validate(req.body);
  
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
  
  try {
    const result = await Accounts.addAccount({ ...value, userId: req.user.id });
    const currencyResult = await Currencies.getCurrency(result[0].currency_id, req.user.country_id);
    result[0].currency = currencyResult[0].title;
    res.status(201).send({
      message: "Account created successfully",
      account: result[0]
    })
  } catch (err) {
    if (err.code == '23505') {
      res.status(400).send({
        message: "Account title must be unique"
      })
    }
  }
})

const updateAccount = catchReject(async (req, res, next) => {
  const { error, value } = updateAccountSchema.validate(req.body);
  
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
})

const deleteAccount = catchReject(async (req, res, next) => {
  const { error, value } = accountSchema.validate(req.params);
  
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
    
  try {
    await Transactions.beginTransaction();
    await Transactions.deleteTransactionsByAccountId(value.id);
    await Accounts.deleteAccount(value.id);
    await Transactions.commitTransaction()
  } catch (error) {
    await Transactions.rollbackTransaction();
    return res.status(500).send({
      message: 'Internal server error',
      error: error.message
    })
  }
    
  return res.status(200).send({
    message: 'Account deleted successfully'
  })
})

router.get('/', getAccounts);
router.get('/:id', getAccount);
router.post('/', addAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;