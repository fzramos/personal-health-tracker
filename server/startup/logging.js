import winston from 'winston';
import 'express-async-errors';
// the above package wraps all ASYNC routes with a try/catch block
// so if an async route encounters an error, it will move on to the error middleware
// this import isn't used here but it needs to be imported somewhere early in the script

export default function () {
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));

  winston.exceptions.handle([
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
  ]);
}
