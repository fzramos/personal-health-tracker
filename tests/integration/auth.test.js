import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { User } from '../../server/models/user.js';
let server;

describe('/api/signin', () => {
  let userId;
  let name;
  let email;
  let password;
  let subjects;
  let salt;
  let encrypted_pw;

  beforeAll(async () => {
    salt = await bcrypt.genSalt(10);
  });

  beforeEach(async () => {
    const { default: myServer } = await import('../../server/app.js');
    server = myServer;
    name = 'reynolds_family';
    email = 'trashman@paddys.com';
    password = 'password';
    subjects = ['Frank'];
    encrypted_pw = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: encrypted_pw,
      subjects,
    });
    userId = user._id.toHexString();
    await user.save();
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany({}); // this line empties the collection after every test
  });
  afterAll(() => {
    mongoose.disconnect();
  });

  function exec() {
    return request(server).post('/api/signin').send({ name, password });
  }

  describe('POST /', () => {
    it('should return 200 if valid user details are passed to the route', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return a valid JTW if given user details are passed', async () => {
      const res = await exec();

      const decoded = jwt.verify(res._body.token, process.env.HT_jwtPrivateKey);
      expect(decoded).toHaveProperty('_id', userId);
    });

    it('should return 200 if valid email and password details are passed to the route', async () => {
      // const res = await exec();
      const res = await request(server)
        .post('/api/signin')
        .send({ name: email, password });

      expect(res.status).toBe(200);
    });

    it('should return 400 status if the given user name is not in the User collection', async () => {
      name = 'abc';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 status if the password is incorrect', async () => {
      password = 'aaaaaaaa';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 status if name property is not in the request', async () => {
      const res = await request(server).post('/api/signin').send({ password });

      expect(res.status).toBe(400);
      expect(res.text.toString()).toContain('name');
    });

    it('should return 400 status if password property is not in the request', async () => {
      const res = await request(server).post('/api/signin').send({ name });

      expect(res.status).toBe(400);
      expect(res.text.toString()).toContain('password');
    });
  });
});
