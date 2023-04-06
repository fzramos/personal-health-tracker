import express from 'express';
import weight from '../routes/weight.js';

export default function (app) {
  app.use(express.json());

  //   if (app.get('env') === 'development') {
  //     app.use(morgan('tiny'));
  //     debug('Morgan activated');
  //   }

  app.use('/api/weight', weight);
}
