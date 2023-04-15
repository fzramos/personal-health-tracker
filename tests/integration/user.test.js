import request from 'supertest';
import mongoose from 'mongoose';
import { User } from '../../server/models/user.js';
let server;

describe('/api/user', () => {
  let userProps = {
    name: 'reynolds_family',
    email: 'abc@d.com',
    password: 'password',
    repeat_password: 'password',
    subjects: ['Frank'],
  };

  beforeEach(async () => {
    userProps = {
      name: 'reynolds_family',
      email: 'abc@d.com',
      password: 'password',
      repeat_password: 'password',
      subjects: ['Frank'],
    };
    const { default: myServer } = await import('../../server/app.js');
    server = myServer;
  });
  afterEach(async () => {
    await server.close();
    await User.deleteMany({}); // this line empties the collection after every test
  });
  afterAll(() => {
    mongoose.disconnect();
  });

  function exec() {
    return request(server).post('/api/user/register').send(userProps);
  }

  describe('POST /register', () => {
    it('should save the given user if the request is valid', async () => {
      const res = await exec();

      const uploadedUser = await User.findById(res.body._id);
      expect(uploadedUser).not.toBeNull();
    });

    it('should return 200 status if the request is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return 400 status if user already exists', async () => {
      await exec();
      // running it twice to see if the same user can be uploaded again
      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
