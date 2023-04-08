import * as dotenv from 'dotenv';
dotenv.config();
import createDebug from 'debug';
const debug = createDebug('app:entry_point');
import winston from 'winston';
import express from 'express';
const app = express();

import logging from './startup/logging.js';
logging();
import db from './startup/db.js';
db();
import routes from './startup/routes.js';
routes(app);
import validation from './startup/validation.js';
validation();

app.get('/', (req, res) => {
  res.send('Hello world');
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => winston.info(`Server listening...`));

export default server;
