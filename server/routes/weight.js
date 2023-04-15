import _ from 'lodash';
import express from 'express';
const router = express.Router();
import { WeightEntry, validate } from '../models/weightEntry.js';
import { User } from '../models/user.js';
import createDebug from 'debug';
import mongoose from 'mongoose';
const debug = createDebug('app:weight_route');
import validateObjectId from '../middleware/validateObjectId.js';
import auth from '../middleware/auth.js';

router.get('/', auth, async (req, res) => {
  console.log(req.user._id);
  console.log(new mongoose.Types.ObjectId(req.user._id));
  // console.log(req.user._id.toObjectId());
  const lst = await WeightEntry.find();
  console.log(lst);
  // const weightEntries = await WeightEntry.find({ userId: req.user._id });
  const weightEntries = await WeightEntry.find({
    userId: new mongoose.Types.ObjectId(req.user._id),
    // userId: req.user._id,
  });
  console.log(weightEntries);
  res.send(weightEntries);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const weightEntry = await WeightEntry.findById(req.params.id);
  if (!weightEntry) {
    return res.status(400).send('Given ID does not exist');
  }

  return res.send(weightEntry);
});

router.delete('/:id', validateObjectId, async (req, res) => {
  const weightEntry = await WeightEntry.findByIdAndDelete(req.params.id);
  if (!weightEntry) {
    return res.status(400).send('Given ID does not exist');
  }

  return res.send(weightEntry);
});

router.post('/', auth, async (req, res) => {
  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }
  // using lodash here so user can't sneak in any additional object parameters
  const weightEntryObj = _.pick(req.body, [
    'weight',
    'unit',
    'subject',
    'weightDate',
    'note',
  ]);
  // the userId attached to this weight entry will be determined by the
  // JWT of the request AKA the _id of the user making the request
  // so users can post only post weight entries to their own accounts
  weightEntryObj.userId = req.user._id;
  const weightEntry = new WeightEntry(weightEntryObj);
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

export default router;
