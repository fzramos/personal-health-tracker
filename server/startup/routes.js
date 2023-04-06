import express from 'express';
import morgan from 'morgan';
import winston from 'winston';
import weight from '../routes/weight.js';
import error from '../middleware/error.js';

export default function (app) {
  app.use(express.json());

  if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    winston.info('Morgan activated');
  }

  app.use('/api/weight', weight);

  app.use(error);
}
