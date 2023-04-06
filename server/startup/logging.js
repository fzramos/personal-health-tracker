import winston from 'winston';

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
