import moment from "moment";
import express from "express";

import { catchReject } from "./../../utils/helper.mjs";
import { transactionSchema, addTransactionSchema, updateTransactionSchema } from "./schema.mjs";
import Accounts from "./../../database/accounts.mjs";
import Transactions from "./../../database/transactions.mjs";

const router = express.Router();

const getTransactions = catchReject(async (req, res, next) => {
  const transactions = await Transactions.getTransactions();
  return res.status(200).send({
    transactions
  })
})

const getTransaction = catchReject(async (req, res, next) => {
  const { error, value } = transactionSchema.validate(req.params);
  
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
    
  const result = await Transactions.getTransaction(value.id);
  if (result.length) {
    return res.status(200).send({
      transaction: result[0]
    })
  } else {
    return res.status(404).send({
      message: 'This kind of transaction is not found'
    })
  }
})

const addTransaction = catchReject(async (req, res, next) => {
  const { error, value } = addTransactionSchema.validate(req.body);
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
  
  value.date = value.date ? moment(value.date).format('YYYY-MM-DD') : value.date
  
  try {
    const result = await Accounts.GetEstimateBalance(value.type, value.amount, value.accountId);
    if (result[0].balance < 0) {
      return res.status(200).send({
        message: 'You have not enough money for expense'
      })
    }
    await Transactions.beginTransaction();
    await Accounts.updateAccountBalance(value.type, value.amount, value.accountId);
    await Transactions.addTransaction(value);
    await Transactions.commitTransaction();
    return res.status(200).send({
      message: 'Transaction done successfully'
    })
  } catch (err) {
    await Transactions.rollbackTransaction();
    return res.status(500).send({
      message: 'Internal server error',
      err: err.message
    })
  }
})

const updateTransaction = catchReject(async (req, res, next) => {
  const { error, value } = updateTransactionSchema.validate({ ...req.params, ...req.body });
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
    
  value.date = value.date ? moment(value.date).format('YYYY-MM-DD') : value.date
    
  try {
    const result = await Transactions.getTransaction(value.id);
    if (result.length) {
      const transaction = result[0];
      if (value.accountId || value.amount) {
        value.accountId = value.accountId ? value.accountId : transaction.accountId
        value.amount = value.amount ? value.amount : transaction.amount
        if (transaction.type === 'income') {
          const result = await Accounts.GetEstimateBalance('expense', transaction.amount, transaction.accountId);
          if (result[0].balance < 0) {
            return res.status(200).send({
              message: 'You can not change account of this transaction'
            })
          }
          try {
            await Transactions.beginTransaction();
            await Accounts.updateAccountBalance('expense', transaction.amount, transaction.accountId);
            await Accounts.updateAccountBalance('income', value.amount, value.accountId);
            await Transactions.updateTransaction(value.id, value.amount, value.accountId);
            await Transactions.commitTransaction();
          } catch (err) {
            await Transactions.rollbackTransaction();
            return res.status(500).send({
              message: 'Internal server error',
              err: err.message
            })
          }
        }
        if (transaction.type === 'expense') {
          const result = await Accounts.GetEstimateBalance('expense', value.amount, value.accountId);
          if (result[0].balance < 0) {
            return res.status(200).send({
              message: 'You can not change account of this transaction'
            })
          }
          try {
            await Transactions.beginTransaction();
            await Accounts.updateAccountBalance('income', transaction.amount, transaction.accountId);
            await Accounts.updateAccountBalance('expense', value.amount,  value.accountId);
            await Transactions.updateTransaction(value.id, value.amount, value.accountId);
            await Transactions.commitTransaction();
          } catch (err) {
            await Transactions.rollbackTransaction();
            return res.status(500).send({
              message: 'Internal server error',
              err: err.message
            })
          }
        }
      } 
      await Transactions.updateTransactionDetails(value.id, value.title, value.description, value.categoryId, value.date);
      return res.status(200).send({
        message: 'Transaction done successfully'
      })
    } else {
      return res.status(404).send({
        message: 'This kind of transaction is not found'
      })
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
        message: 'Internal server error',
        err: err.message
      })
  }
})

const deleteTransaction = catchReject(async (req, res, next) => {
  const { error, value } = transactionSchema.validate(req.params);
  
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
  
  try {
    const result = await Transactions.getTransaction(value.id);
    if (result.length) {
      const transaction = result[0];
      try {
        await Transactions.beginTransaction();
        await Accounts.updateAccountBalance(
          transaction.type === 'expense' ? 'income' : 'expense', 
          transaction.amount,  
          transaction.accountId
        );
        await Transactions.deleteTransaction(value.id);
        await Transactions.commitTransaction();
        return res.status(200).send({
          message: "Transction deleted successfully"
        })
      } catch (err) {
        await Transactions.rollbackTransaction();
        return res.status(500).send({
          message: 'Internal server error',
          err: err.message
        })
      }
    } else {
      return res.status(404).send({
        message: 'This kind of transaction is not found'
      })
    }
  } catch (err) {
    return res.status(500).send({
      message: 'Internal server error',
      err: err.message
    })
  }
})

router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.post('/', addTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;