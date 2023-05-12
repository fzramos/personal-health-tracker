import express from 'express';
import morgan from 'morgan';
import winston from 'winston';
import weight from '../routes/weight.js';
import user from '../routes/user.js';
import auth from '../routes/auth.js';
import error from '../middleware/error.js';

export default function (app) {
  app.use(express.json());

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
    winston.info('Morgan activated');
  }

  app.use('/api/weight', weight);
  app.use('/api/user', user);
  app.use('/api/signin', auth);

  app.use(error);
}
