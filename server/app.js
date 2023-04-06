import * as dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import createDebug from 'debug';
const debug = createDebug('app:entry_point');
import winston from 'winston';
import express from 'express';
const app = express();

import logging from './startup/logging.js';
logging();

app.use(express.json());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan activated');
}
app.get('/', (req, res) => {
  res.send('Hello world');
});

const weight_history = [
  {
    id: 1,
    weight: 150,
    unit: 'pounds',
    subject: 'Same',
    weigh_datetime: '2023-03-25T12:00:00Z',
    note: 'Feeling good today',
    user: {
      id: 1,
      name: 'reynolds_family',
    },
  },
  {
    id: 2,
    weight: 155,
    unit: 'pounds',
    subject: 'Max',
    weigh_datetime: '2023-03-25T12:00:00Z',
    note: 'Feeling good today',
    user: {
      id: 1,
      name: 'reynolds_family',
    },
  },
];

const users = [
  {
    id: 1,
    name: 'reynolds_family',
    subjects: ['Sam', 'Max'],
  },
];

app.get('/api/weight', (req, res) => {
  res.send(weight_history);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => winston.info(`Server listening...`));
