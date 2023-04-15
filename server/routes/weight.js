import _ from 'lodash';
import express from 'express';
const router = express.Router();
import { WeightEntry, validate } from '../models/weightEntry.js';
import { User } from '../models/user.js';
import createDebug from 'debug';
const debug = createDebug('app:weight_route');
import validateObjectId from '../middleware/validateObjectId.js';
import auth from '../middleware/auth.js';

router.get('/', auth, async (req, res) => {
  const weightEntries = await WeightEntry.find({});
  res.send(weightEntries);
});

router.get('/:id', validateObjectId, async (req, res) => {
  // const weightEntry = weight_history.find((elem) => elem._id === req.params.id);
  const weightEntry = await WeightEntry.findById(req.params.id);
  if (!weightEntry) {
    return res.status(400).send('Given ID does not exist');
  }

  return res.send(weightEntry);
});

router.delete('/:id', validateObjectId, async (req, res) => {
  // const weightEntry = weight_history.find((elem) => elem._id === req.params.id);
  const weightEntry = await WeightEntry.findByIdAndDelete(req.params.id);
  if (!weightEntry) {
    return res.status(400).send('Given ID does not exist');
  }

  return res.send(weightEntry);
});

router.post('/', async (req, res) => {
  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.userId);
  if (!user) {
    return res.status(400).send('Given user id not found in database');
  } else if (!user.subjects.includes(req.body.subject)) {
    return res
      .status(400)
      .send('Given subject not assigned to the specified user');
  }
  // using lodash here so user can't sneak in any additional object parameters
  const weightEntry = new WeightEntry(
    _.pick(req.body, [
      'weight',
      'unit',
      'subject',
      'weightDate',
      'note',
      'userId',
    ])
  );
  await weightEntry.save();

  res.send(
    _.pick(weightEntry, [
      '_id',
      'weight',
      'unit',
      'subject',
      'weightDate',
      'note',
      'userId',
    ])
  );
});

router.put('/:id', validateObjectId, async (req, res) => {
  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.userId);
  if (!user) {
    return res.status(400).send('Given user id not found in database');
  } else if (!user.subjects.includes(req.body.subject)) {
    return res
      .status(400)
      .send('Given subject not assigned to the specified user');
  }
  const weightEntry = await WeightEntry.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, [
        'weight',
        'unit',
        'subject',
        'weightDate',
        'note',
        'userId',
      ]),
    },
    { new: true }
  );
  if (!weightEntry) {
    return res.status(400).send('Given ID does not exist');
  }

  return res.send(weightEntry);
});

// router.put('/:id', function (req, res) {
//   var todo = getTodoById(req.body.todo.id);
//   if (todo) {
//     editTodo(req.body.todo.id, req.body.todo);
//     res.send('ok');
//   } else {
//     res.status(400).send('record not found');
//   }
// });

// TODO: In post route, make sure given subject is assigned to that user
// TODO: IF no date given, just use todays date
export default router;
