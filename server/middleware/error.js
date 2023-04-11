import winston from 'winston';

export default function (err, req, res, next) {
  // if (err instanceof SpecificError) {
  //  // specific error
  // if (err of )
  winston.error(err.message, { metadata: err.stack });

  res.status(500).send('Something failed.');

  next();
}
