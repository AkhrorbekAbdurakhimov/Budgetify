import cors from 'cors';
import express from 'express';
import passport from 'passport';

import authRouter from './routes/auth/index.mjs';
import accountsRouter from './routes/accounts/index.mjs';
import categoriesRouter from './routes/categories/index.mjs';
import currenciesRouter from './routes/currencies/index.mjs';
import statisticsRouer from './routes/statistics/index.mjs';
import transactionsRouter from './routes/transactions/index.mjs';
import subscriptionsRouter from './routes/subscriptions/index.mjs';

import authMiddleware from './middlewares/auth.mjs';
import { errorMessageHandler } from './utils/helper.mjs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/accounts', authMiddleware, accountsRouter);
app.use('/api/categories', authMiddleware, categoriesRouter);
app.use('/api/currencies', authMiddleware, currenciesRouter);
app.use('/api/statistics', authMiddleware, statisticsRouer);
app.use('/api/transactions', authMiddleware, transactionsRouter);
app.use('/api/subscriptions', authMiddleware, subscriptionsRouter);

app.use((err, req, res, next) => {
  console.log(err);
  const error = errorMessageHandler(err.status, err, err.message);
  res.status(err.status || 500).send(error);
});


export default app;