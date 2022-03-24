import cors from 'cors';
import express from 'express';
import passport from 'passport';

import authRouter from './routes/auth/index.mjs';
import accountsRouter from './routes/accounts/index.mjs';
import transactionsRouter from './routes/transactions/index.mjs';

import authMiddleware from './middlewares/auth.mjs';
import { errorMessageHandler } from './utils/helper.mjs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/accounts', authMiddleware, accountsRouter);
app.use('/api/transactions', authMiddleware, transactionsRouter);

app.use((err, req, res, next) => {
  console.log(err);
  const error = errorMessageHandler(err.status, err, err.message);
  res.status(err.status || 500).send(error);
});


export default app;