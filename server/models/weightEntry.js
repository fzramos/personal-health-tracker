import mongoose from 'mongoose';
import Joi from 'joi';

const weightEntrySchema = new mongoose.Schema({
  weight: {
    type: Number,
    min: 0,
    max: 1000,
    required: true,
  },
  unit: {
    type: String,
    default: 'pounds',
    lowercase: true,
    trim: true,
  },
  subject: {
    type: String,
    minLength: 1,
    maxLength: 100,
    trim: true,
    required: true,
  },
  weightDate: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    maxLength: 300,
  },
  userId: mongoose.ObjectId,
});

const WeightEntry = mongoose.model('Weight', weightEntrySchema);

const validateWeightEntry = async (user) => {
  const schema = Joi.object({
    weight: Joi.number().min(0).max(1000).required(),
    unit: Joi.string().valid(['pounds', 'kilogram']),
    subject: Joi.string().min(1).max(100).required(),
    weightDate: Joi.date(),
    note: Joi.string().max(300),
    userId: Joi.objectId(),
  });
  return await schema.validateAsync(user);
};

// NOTE: Mongoose and Joi schemas are subtly different
// EX: Mongoose password is longer since it will be encrypted, Joi expects an unencrypted password
export { WeightEntry, validateWeightEntry as validate };
