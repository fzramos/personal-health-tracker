import express from 'express';
const router = express.Router();
import { WeightEntry, validate } from '../models/weightEntry.js';
import mongoose from 'mongoose';
import validateObjectId from '../middleware/validateObjectId.js';

// console.log(new mongoose.Types.ObjectId().toHexString());
const weight_history = [
  {
    _id: '64302c58cad3def3f7239603',
    weight: 150,
    unit: 'pounds',
    subject: 'Sam',
    weightDate: '2023-03-25',
    note: 'Feeling good today',
    userId: '64302c58cad3def3f7239600',
  },
  {
    _id: '64302c678be165110cce1959',
    weight: 155,
    unit: 'pounds',
    subject: 'Max',
    weightDate: '2023-03-25T12:00:00Z',
    note: 'Feeling good today',
    userId: '64302c58cad3def3f7239600',
  },
];

const users = [
  {
    id: 1,
    name: 'reynolds_family',
    subjects: ['Sam', 'Max'],
  },
];

router.get('/', (req, res) => {
  res.send(weight_history);
});

router.get('/:id', validateObjectId, (req, res) => {
  const weightEntry = weight_history.find((elem) => elem._id === req.params.id);
  if (!weightEntry) {
    return res.status(404).send('Given ID does not exist');
  }

  return res.send(weightEntry);
});

router.delete('/:id', validateObjectId, (req, res) => {
  const weightEntry = weight_history.find((elem) => elem._id === req.params.id);
  // TODO: WILL USE FIND BY ID AND DELETE HERE once MongoDB connected
  if (!weightEntry) {
    return res.status(404).send('Given ID does not exist');
  }

  return res.send(weightEntry);
});

// TODO: In post route, make sure given subject is assigned to that user
// TODO: IF no date given, just use todays date
export default router;
