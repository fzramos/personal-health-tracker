import express from 'express';
const router = express.Router();
import { WeightEntry, validate } from '../models/weightEntry';
const weight_history = [
  {
    id: 1,
    weight: 150,
    unit: 'pounds',
    subject: 'Same',
    weigh_datetime: '2023-03-25T12:00:00Z',
    note: 'Feeling good today',
    user: {
      id: 1,
      name: 'reynolds_family',
    },
  },
  {
    id: 2,
    weight: 155,
    unit: 'pounds',
    subject: 'Max',
    weigh_datetime: '2023-03-25T12:00:00Z',
    note: 'Feeling good today',
    user: {
      id: 1,
      name: 'reynolds_family',
    },
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

// TODO: In post route, make sure given subject is assigned to that user
// TODO: IF no date given, just use todays date
// TODO: /:id Needs middleware to validate the objectId
export default router;
