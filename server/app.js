import { env } from 'custom-env';
env();
import winston from 'winston';
import express from 'express';
const app = express();

import logging from './startup/logging.js';
logging();
import startupConfig from './startup/config.js';
startupConfig();
import db from './startup/db.js';
db();
import routes from './startup/routes.js';
routes(app);
import validation from './startup/validation.js';
validation();
import prod from './startup/prod.js';
if (process.env.NODE_ENV === 'production') {
  prod(app);
}

app.get('/', (req, res) => {
  res.send('Hello world');
});

let port = process.env.PORT || 8080;
if (process.env.NODE_ENV === 'test') port = 0;

const server = app.listen(port, () => winston.info(`Server listening...`));

export default server;
