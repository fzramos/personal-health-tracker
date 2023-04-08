import request from 'supertest';
import { WeightEntry } from '../../server/models/weightEntry.js';
import mongoose from 'mongoose';
import { User } from '../../server/models/user.js';
let server;

describe('/api/weight', () => {
  beforeEach(async () => {
    const { default: myServer } = await import('../../server/app.js');
    // server = require('../../index');
    server = myServer;
  });
  afterEach(async () => {
    await server.close();
    await WeightEntry.deleteMany({}); // this line empties the collection after every test
  });
  afterAll(() => mongoose.disconnect());

  describe('GET /', () => {
    it('should return all weight entries', async () => {
      const userId = new mongoose.Types.ObjectId().toHexString();
      await WeightEntry.collection.insertMany([
        {
          weight: 150,
          unit: 'pounds',
          subject: 'Sam',
          weightDate: '2023-03-25',
          note: 'Feeling good today',
          userId: userId,
        },
        {
          weight: 155,
          unit: 'pounds',
          subject: 'Max',
          weightDate: '2023-03-25T12:00:00Z',
          note: 'Feeling good today',
          userId: userId,
        },
      ]);

      const res = await request(server).get('/api/weight');
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((we) => we.note === 'Feeling good today')
      ).toBeTruthy(); // body should have some value that looks like this
    });
  });
  describe('GET /:id', () => {
    it('should return weight entry if valid entry ObjectId passed', async () => {
      const weightEntry = new WeightEntry({
        weight: 150,
        unit: 'pounds',
        subject: 'Sam',
        weightDate: '2023-03-25',
        note: 'Feeling good today',
        userId: new mongoose.Types.ObjectId().toHexString(),
      });
      const weightEntryId = weightEntry._id.toHexString();
      await weightEntry.save();

      const res = await request(server).get(`/api/weight/${weightEntryId}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body._id).toBe(weightEntryId);
    });
  });
});
