import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';
import _ from 'lodash';
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

    it('should return 400 status if user already exists', async () => {
      await exec();
      // running it twice to see if the same user can be uploaded again
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 status if user name is not in the request', async () => {
      delete userProps.name;

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text.toString()).toContain('name');
    });
    it('should return 400 status if repeat_password property does not equal password', async () => {
      userProps.password = 'goodPass123!';
      userProps.repeat_password = 'badPass000!';

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text.toString()).toContain('repeat_password');
    });

    it("should return a JWT in the response header with the user's details", async () => {
      const res = await exec();
      const token = res.header['x-auth-token'];

      expect(res.header).toHaveProperty('x-auth-token');
      const decoded = jwt.verify(token, process.env.HT_jwtPrivateKey);
      expect(jwt.verify(token, process.env.HT_jwtPrivateKey)).toMatchObject(
        _.pick(res.body, ['_id', 'subjects'])
      );
    });
  });
});
