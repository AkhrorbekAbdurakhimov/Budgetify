import express from "express";

import { catchReject } from "./../../utils/helper.mjs";
import { accountSchema, addAccountSchema, updateAccountSchema } from "./schema.mjs";
import Accounts from "./../../database/accounts.mjs";

const router = express.Router();

const getAccounts = catchReject(async (req, res, next) => {
  const accounts = await Accounts.getAllAccounts();
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
    res.status(201).send({
      message: "Account created successfully",
      account: result[0]
    })
  } catch (err) {
    if (err.code == '23505') {
      res.status(209).send({
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

router.get('/', getAccounts);
router.get('/:id', getAccount);
router.post('/', addAccount);
router.put('/:id', updateAccount);

export default router;