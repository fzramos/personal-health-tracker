import mongoose from 'mongoose';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import winston from 'winston';
import config from 'config';

export default function () {
  const mongoUri = process.env.HT_mongoURI;
  mongoose
    .connect(mongoUri, { useUnifiedTopology: true, dbName: config.get('db') })
    .then(() => winston.info(`Connected to MongoDB`));
}
