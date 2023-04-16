import request from 'supertest';
import { WeightEntry } from '../../server/models/weightEntry.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';
import { User } from '../../server/models/user.js';
let server;

describe('/api/weight', () => {
  beforeEach(async () => {
    const { default: myServer } = await import('../../server/app.js');
    server = myServer;
  });
  afterEach(async () => {
    await server.close();
    await WeightEntry.deleteMany({}); // this line empties the collection after every test
  });
  afterAll(() => {
    mongoose.disconnect();
  });

  describe('GET /', () => {
    let token;
    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it("should return 401 status if the request doesn't have a valid JWT", async () => {
      const res = await request(server).get('/api/weight');

      expect(res.status).toBe(401);
    });

    it("should return all weight entries related to the user's id if a valid JWT is included", async () => {
      // const userId = new mongoose.Types.ObjectId().toHexString();
      const decoded = jwt.verify(token, process.env.HT_jwtPrivateKey);
      const userId = decoded._id;

      // Inserting 1 record with the ID and 1 without to confirm were not
      // getting everything, just the req user's data
      await WeightEntry.collection.insertMany([
        {
          weight: 150,
          unit: 'pounds',
          subject: 'Sam',
          weightDate: '2023-03-25',
          note: 'Feeling good today',
          userId: new mongoose.Types.ObjectId(userId),
        },
        {
          weight: 155,
          unit: 'pounds',
          subject: 'Max',
          weightDate: '2023-03-25T12:00:00Z',
          note: 'Feeling good today',
          userId: new mongoose.Types.ObjectId(),
        },
      ]);

      const res = await request(server)
        .get('/api/weight')
        .set('x-auth-token', token);

      expect(res.body.length).toBe(1);
      expect(
        res.body.some((we) => we.note === 'Feeling good today')
      ).toBeTruthy(); // body should have some value that looks like this
    });
  });

  describe('GET /:id', () => {
    let token;
    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it("should return 401 status if the request doesn't have a valid JWT", async () => {
      const randomObjectId = new mongoose.Types.ObjectId().toHexString();

      const res = await request(server).get(`/api/weight/${randomObjectId}`);

      expect(res.status).toBe(401);
    });

    it('should return 400 error if an invalid ObjectId is passed', async () => {
      const res = await request(server)
        .get('/api/weight/a')
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
    });

    it('should return 400 error if an ObjectId is passed that is not in the weight entry collection', async () => {
      const randomObjectId = new mongoose.Types.ObjectId().toHexString();

      const res = await request(server)
        .get(`/api/weight/${randomObjectId}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
    });

    it('should return 400 error if the requesting userId does not match the weightEntry userId', async () => {
      const weightEntry = new WeightEntry({
        weight: 150,
        unit: 'pounds',
        subject: 'Sam',
        weightDate: '2023-03-25',
        note: 'Feeling good today',
        userId: new mongoose.Types.ObjectId().toHexString(),
      });

      const res = await request(server)
        .get(`/api/weight/${weightEntry._id}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
    });

    it('should return weight entry if valid entry ObjectId is passed', async () => {
      const decoded = jwt.verify(token, process.env.HT_jwtPrivateKey);
      const userId = decoded._id;
      const weightEntry = new WeightEntry({
        weight: 150,
        unit: 'pounds',
        subject: 'Sam',
        weightDate: '2023-03-25',
        note: 'Feeling good today',
        userId: userId,
      });
      const weightEntryId = weightEntry._id.toHexString();
      await weightEntry.save();

      const res = await request(server)
        .get(`/api/weight/${weightEntryId}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body._id).toBe(weightEntryId);
    });
  });

  describe('DELETE /:id', () => {
    let token;
    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it("should return 401 status if the request doesn't have a valid JWT", async () => {
      const randomObjectId = new mongoose.Types.ObjectId().toHexString();

      const res = await request(server).delete(`/api/weight/${randomObjectId}`);

      expect(res.status).toBe(401);
    });

    it('should return 400 error if an invalid ObjectId is passed', async () => {
      const res = await request(server)
        .delete('/api/weight/a')
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
    });

    it('should return 400 error if an ObjectId is passed that is not in the weight entry collection', async () => {
      const randomObjectId = new mongoose.Types.ObjectId().toHexString();

      const res = await request(server)
        .delete(`/api/weight/${randomObjectId}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
    });

    it('should return 400 error if the requesting userId does not match the weightEntry userId', async () => {
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

      const res = await request(server)
        .delete(`/api/weight/${weightEntryId}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
    });

    it('should delete weight entry if valid entry ObjectId is passed', async () => {
      const decoded = jwt.verify(token, process.env.HT_jwtPrivateKey);
      const userId = decoded._id;
      const weightEntry = new WeightEntry({
        weight: 150,
        unit: 'pounds',
        subject: 'Sam',
        weightDate: '2023-03-25',
        note: 'Feeling good today',
        userId: userId,
      });
      const weightEntryId = weightEntry._id.toHexString();
      await weightEntry.save();

      const res = await request(server)
        .delete(`/api/weight/${weightEntryId}`)
        .set('x-auth-token', token);

      const removedWeightEntry = await WeightEntry.findById(weightEntryId);
      expect(removedWeightEntry).not.toBeTruthy;
      // expect(res.status).toBe(200);
      // expect(res.body).toBeDefined();
      // expect(res.body._id).toBe(weightEntryId);
    });

    it('should return the deleted weight entry if valid ObjectId is passed', async () => {
      const decoded = jwt.verify(token, process.env.HT_jwtPrivateKey);
      const userId = decoded._id;
      const weightEntry = new WeightEntry({
        weight: 150,
        unit: 'pounds',
        subject: 'Sam',
        weightDate: '2023-03-25',
        note: 'Feeling good today',
        userId: userId,
      });
      const weightEntryId = weightEntry._id.toHexString();
      await weightEntry.save();

      const res = await request(server)
        .delete(`/api/weight/${weightEntryId}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body._id).toBe(weightEntryId);
    });
  });

  describe('POST /', () => {
    let weight, unit, subject, weightDate, note, userId, token;
    // all of these will try to post some
    const weightEntryValues = {
      weight: 150,
      unit: 'pounds',
      subject: 'Sam',
      weightDate: '2023-03-25',
      note: 'Feeling good today',
    };
    let tokenOrigVal;

    beforeAll(async () => {
      const user = new User({
        name: 'reynolds_family',
        password: '12345',
        subjects: ['Sam'],
      });
      await user.save();
      tokenOrigVal = user.generateAuthToken();
      weightEntryValues.userId = user._id;
    });

    function exec() {
      return request(server)
        .post('/api/weight')
        .send({
          weight,
          unit,
          subject,
          weightDate,
          note,
        })
        .set('x-auth-token', token);
    }

    beforeEach(() => {
      ({ weight, unit, subject, weightDate, note } = weightEntryValues);
      token = tokenOrigVal;
      userId = jwt.verify(token, process.env.HT_jwtPrivateKey)._id;
    });
    afterAll(async () => {
      await User.deleteMany({});
    });

    it("should return 401 status if the request doesn't have a valid JWT", async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 code if a non-number weight is passed', async () => {
      weight = null;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // it('should return 400 if the request userId parameter is not a valid Object Id', async () => {
    //   userId = 'a';

    //   const res = await exec();

    //   expect(res.status).toBe(400);
    // });

    it('should return 400 if the given request subject is not assigned to the given userId', async () => {
      subject = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should set unit to pounds if request does not include the parameter', async () => {
      const res = await request(server)
        .post('/api/weight')
        .set('x-auth-token', token)
        .send({
          weight,
          subject,
          note,
        });

      expect(res.body.unit).toBe('pounds');
    });

    it('should save given weight entry if the request is valid', async () => {
      await exec();

      const uploadedWeightEntry = await WeightEntry.find({
        weight,
        unit,
        subject,
        weightDate,
        note,
      });

      expect(uploadedWeightEntry).not.toHaveLength(0);
    });

    it('should set weightDate to be current date if none is passed', async () => {
      const res = await request(server)
        .post('/api/weight')
        .set('x-auth-token', token)
        .send({
          weight,
          unit,
          subject,
          note,
        });
      expect(res.body.weightDate).toBeDefined();
    });
  });

  describe('PUT /:id', () => {
    const weightEntryValues = {
      weight: 150,
      unit: 'pounds',
      subject: 'Sam',
      weightDate: '2023-03-25',
      note: 'Feeling good today',
    };
    let { weight, unit, subject, weightDate, note } = weightEntryValues;
    let weightEntryId, userId, tokenOrigVal, token;

    beforeAll(async () => {
      // upload a User and WeightEntry so we can modify the weight entry in this route
      const user = new User({
        name: 'reynolds_family',
        password: '12345',
        subjects: ['Sam'],
      });
      await user.save();
      tokenOrigVal = user.generateAuthToken();
      weightEntryValues.userId = user._id;
    });

    async function saveWeightEntry() {
      const weightEntry = new WeightEntry({
        weight: 0,
        unit,
        subject: subject,
        weightDate,
        note,
        userId: weightEntryValues.userId,
      });
      await weightEntry.save();
      weightEntryId = weightEntry._id;
    }

    function exec() {
      // update weight entry posted above so "weight" property changes from 0 to 150
      return request(server)
        .put(`/api/weight/${weightEntryId}`)
        .set('x-auth-token', token)
        .send({
          weight,
          unit,
          subject,
          weightDate,
          note,
        });
    }

    beforeEach(() => {
      ({ weight, unit, subject, weightDate, note, userId } = weightEntryValues);
      token = tokenOrigVal;
    });
    afterAll(async () => {
      await User.deleteMany({});
      await WeightEntry.deleteMany({});
    });

    it("should return 401 status if the request doesn't have a valid JWT", async () => {
      weightEntryId = new mongoose.Types.ObjectId().toHexString();
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 code if an invalid object id parameter is passed', async () => {
      weightEntryId = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 code if an non-existent object id parameter is passed ', async () => {
      weightEntryId = new mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 code if the ID of the requesting user does not match the object/s userId that is the target of the put', async () => {
      const uploadedWeightEntry = new WeightEntry({
        weight: 0,
        unit,
        subject: subject,
        weightDate,
        note,
        userId: new mongoose.Types.ObjectId().toHexString(),
      });
      await uploadedWeightEntry.save();

      weightEntryId = uploadedWeightEntry._id;
      // userId of the above won't match the userId in the current JWT
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 code if a non-number weight is passed', async () => {
      weight = null;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // it('should return 400 if the request userId parameter is not a valid Object Id', async () => {
    //   await saveWeightEntry();

    //   userId = 'a';

    //   const res = await exec();

    //   expect(res.status).toBe(400);
    // });

    it('should return 400 if the given request subject is not assigned to the given userId', async () => {
      await saveWeightEntry();

      subject = 'a';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if the request is valid', async () => {
      await saveWeightEntry();

      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should set unit to pounds if request does not include the parameter', async () => {
      await saveWeightEntry();

      const res = await request(server)
        .put(`/api/weight/${weightEntryId}`)
        .set('x-auth-token', token)
        .send({
          weight,
          subject,
          note,
        });

      expect(res.body.unit).toBe('pounds');
    });

    it('should save the modified weight entry if the request is valid', async () => {
      await saveWeightEntry();

      await exec();

      const uploadedWeightEntry = await WeightEntry.findById(weightEntryId);

      expect(uploadedWeightEntry.weight).toBe(150);
    });

    it('should set weightDate to be current date if none is passed', async () => {
      await saveWeightEntry();

      const res = await request(server)
        .put(`/api/weight/${weightEntryId}`)
        .set('x-auth-token', token)
        .send({
          weight,
          unit,
          subject,
          note,
        });

      expect(res.body.weightDate).toBeDefined();
    });
  });
});
