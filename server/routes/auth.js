import express from 'express';
const router = express.Router();
import _ from 'lodash';
import Joi from 'joi';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import winston from 'winston';

const isEmail = (str) => {
  const result = str.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  console.log(result);
  winston.info(result);
  return result;
};

router.post('/', async (req, res) => {
  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user;
  if (isEmail(req.body.name)) {
    user = await User.findOne({ email: req.body.name });
  } else {
    user = await User.findOne(_.pick(req.body, 'name'));
  }
  if (!user) return res.status(400).send('Invalid username or password');
  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validatePassword)
    return res.status(400).send('Invalid username or password');

  const token = user.generateAuthToken();
  res.send(token);
});

async function validate(credentials) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    password: Joi.string().min(1).max(500).required(),
  });

  return await schema.validateAsync(credentials);
}

export default router;
