import { User, validate } from '../models/user.js';
import express from 'express';
const router = express.Router();
import winston from 'winston';
import _ from 'lodash';

router.post('/register', async (req, res) => {
  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }
  const currentUser = await User.find({
    name: req.body.name,
  });
  if (currentUser.length !== 0) {
    return res.status(400).send('Given user name already exists');
  }

  // Is this needed or is it taken care of by Joi (or can I take care of it with Joi?)
  if (req.body.password !== req.body.repeat_password) {
    return res.status(400).send('password and repeat_password must match');
  }

  const user = new User(
    _.pick(req.body, [
      'name',
      'email',
      'password',
      'repeat_password',
      'subjects',
    ])
  );
  await user.save();

  res.send(
    _.pick(user, [
      '_id',
      'name',
      'email',
      'password',
      'repeat_password',
      'subjects',
    ])
  );
});

export default router;
