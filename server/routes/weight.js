import _ from 'lodash';
import express from 'express';
const router = express.Router();
import { WeightEntry, validate } from '../models/weightEntry.js';
import { User } from '../models/user.js';
import mongoose from 'mongoose';
import createDebug from 'debug';
const debug = createDebug('app:weight_route');
import validateObjectId from '../middleware/validateObjectId.js';

router.get('/', async (req, res) => {
  const weightEntries = await WeightEntry.find({});
  res.send(weightEntries);
});

router.get('/:id', validateObjectId, async (req, res) => {
  // const weightEntry = weight_history.find((elem) => elem._id === req.params.id);
  const weightEntry = await WeightEntry.findById(req.params.id);
  if (!weightEntry) {
    return res.status(404).send('Given ID does not exist');
  }

  return res.send(weightEntry);
});

router.delete('/:id', validateObjectId, async (req, res) => {
  // const weightEntry = weight_history.find((elem) => elem._id === req.params.id);
  const weightEntry = await WeightEntry.findByIdAndDelete(req.params.id);
  // TODO: WILL USE FIND BY ID AND DELETE HERE once MongoDB connected
  if (!weightEntry) {
    return res.status(404).send('Given ID does not exist');
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
  } else if (!_.some(user.subjects, { subject: req.body.subject })) {
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

// TODO: In post route, make sure given subject is assigned to that user
// TODO: IF no date given, just use todays date
export default router;
