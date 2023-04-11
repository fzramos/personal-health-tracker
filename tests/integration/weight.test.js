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
    it('should return 404 error if an invalid ObjectId is passed', async () => {
      const res = await request(server).get('/api/weight/a');

      expect(res.status).toBe(404);
    });

    it('should return 404 error if an ObjectId is passed that is not in the weight entry collection', async () => {
      const randomObjectId = new mongoose.Types.ObjectId().toHexString();

      const res = await request(server).get(`/api/weight/${randomObjectId}`);

      expect(res.status).toBe(404);
    });

    it('should return weight entry if valid entry ObjectId is passed', async () => {
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
  describe('DELETE /:id', () => {
    it('should return 404 error if an invalid ObjectId is passed', async () => {
      const res = await request(server).delete('/api/weight/a');

      expect(res.status).toBe(404);
    });

    it('should return 404 error if an ObjectId is passed that is not in the weight entry collection', async () => {
      const randomObjectId = new mongoose.Types.ObjectId().toHexString();

      const res = await request(server).delete(`/api/weight/${randomObjectId}`);

      expect(res.status).toBe(404);
    });

    it('should delete weight entry if valid entry ObjectId is passed', async () => {
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

      const res = await request(server).delete(`/api/weight/${weightEntryId}`);

      const removedWeightEntry = await WeightEntry.findById(weightEntryId);
      expect(removedWeightEntry).not.toBeTruthy;
      // expect(res.status).toBe(200);
      // expect(res.body).toBeDefined();
      // expect(res.body._id).toBe(weightEntryId);
    });

    it('should return the deleted weight entry if valid ObjectId is passed', async () => {
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

      const res = await request(server).delete(`/api/weight/${weightEntryId}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body._id).toBe(weightEntryId);
    });
  });

  describe('POST /', () => {
    let weight, unit, subject, weightDate, note, userId;
    // all of these will try to post some
    const weightEntryValues = {
      weight: 150,
      unit: 'pounds',
      subject: 'Sam',
      weightDate: '2023-03-25',
      note: 'Feeling good today',
      userId: new mongoose.Types.ObjectId().toHexString(),
    };

    function exec() {
      return request(server).post('/api/weight').send({
        weight,
        unit,
        subject,
        weightDate,
        note,
        userId,
      });
    }

    beforeEach(() => {
      ({ weight, unit, subject, weightDate, note, userId } = weightEntryValues);
    });

    it('should return 400 code if a non-number weight is passed', async () => {
      weight = null;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save given weight entry if the request is valid', async () => {
      await exec();

      const uploadedWeightEntry = await WeightEntry.find({
        weight,
        unit,
        subject,
        weightDate,
        note,
        userId,
      });

      expect(uploadedWeightEntry).not.toHaveLength(0);
    });

    it('should set weightDate to be current date if none is passed', async () => {
      const res = await request(server).post('/api/weight').send({
        weight,
        unit,
        subject,
        note,
        userId,
      });

      expect(res.body.weightDate).toBeDefined();
    });
  });
});
