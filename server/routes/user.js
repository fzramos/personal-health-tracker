import { User, validate } from '../models/user.js';
import express from 'express';
const router = express.Router();
import _ from 'lodash';
import bcrypt from 'bcrypt';

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

  const userObj = _.pick(req.body, ['name', 'email', 'subjects']);
  const salt = await bcrypt.genSalt(10);
  userObj.password = await bcrypt.hash(req.body.password, salt);

  const user = new User(userObj);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .send(
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

// to do: need route to add so a user can add a subject to their account
router.post('/addSubject', async () => {});

export default router;
