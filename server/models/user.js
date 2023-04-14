import mongoose from 'mongoose';
import Joi from 'joi';

// Mongoose will limit what can be uploaded to MongoDB
// Last line of data quality defense
// const subjectSchema = new mongoose.Schema({
//   subject: {
//     type: String,
//     minLength: 1,
//     maxLength: 100,
//   },
// });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 1,
    maxLength: 100,
    trim: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    minLength: 3,
    maxLength: 255,
    trim: true,
  },
  password: {
    type: String,
    minLength: 5,
    maxLength: 1120,
  },
  subjects: [
    {
      type: String,
      minLength: 1,
      maxLength: 100,
    },
  ],
});

const User = mongoose.model('User', userSchema);

// Joi will be used to validate API request data
// First line of defense for data quality
const validateUser = async (user) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().min(3).max(255),
    password: Joi.string().min(5).max(500).required(),
    repeat_password: Joi.ref('password'),
    subjects: Joi.array().items(Joi.string().min(1), max(100)).required(),
  });
  return await schema.validateAsync(user);
};

// NOTE: Mongoose and Joi schemas are subtly different
// EX: Mongoose password is longer since it will be encrypted, Joi expects an unencrypted password
export { User, validateUser as validate };
