import _ from 'lodash';
import express from 'express';
const router = express.Router();
import { WeightEntry, validate } from '../models/weightEntry.js';
import createDebug from 'debug';
import mongoose from 'mongoose';
const debug = createDebug('app:weight_route');
import validateObjectId from '../middleware/validateObjectId.js';
import auth from '../middleware/auth.js';

router.get('/', auth, async (req, res) => {
  const weightEntries = await WeightEntry.find({
    userId: new mongoose.Types.ObjectId(req.user._id),
  });
  res.send(weightEntries);
});

router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const weightEntry = await WeightEntry.findOne({
    _id: req.params.id,
    userId: new mongoose.Types.ObjectId(req.user._id),
  });
  if (!weightEntry) {
    return res
      .status(400)
      .send(
        'Given ID does not exist or the current user is unauthorized to view it'
      );
  }

  return res.send(weightEntry);
});

router.delete('/:id', [validateObjectId, auth], async (req, res) => {
  // const weightEntry = await WeightEntry.findByIdAndDelete(req.params.id);
  const weightEntry = await WeightEntry.findOneAndDelete({
    _id: req.params.id,
    userId: new mongoose.Types.ObjectId(req.user._id),
  });
  if (!weightEntry) {
    return res
      .status(400)
      .send(
        'Given ID does not exist or the current user is unauthorized to delete it'
      );
  }

  return res.send(weightEntry);
});

router.post('/', auth, async (req, res) => {
  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }

  // JWT has the SUBJECTS assigned to the user, so just checking that
  // before posting the new record
  if (!req.user.subjects.includes(req.body.subject))
    return res
      .status(400)
      .send(
        'Current user does not have the given subject registered to their account'
      );

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

router.put('/:id', [validateObjectId, auth], async (req, res) => {
  try {
    await validate(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }

  // const user = await User.findById(req.body.userId);
  // if (!user) {
  //   return res.status(400).send('Given user id not found in database');
  // } else
  if (!req.user.subjects.includes(req.body.subject)) {
    return res
      .status(400)
      .send('Given subject not assigned to the requesting user');
  }

  const weightEntry = await WeightEntry.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(req.user._id),
    },
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
    return res
      .status(400)
      .send(
        'Given ID does not exist or the current user is unauthorized to update it.'
      );
  }

  return res.send(weightEntry);
});

export default router;
