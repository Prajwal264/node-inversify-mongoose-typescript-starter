import { Schema, model } from 'mongoose';

export interface IUser {
  userId: string;
  email: string;
  password: string;
}

const usersSchema = new Schema({
  userId: {
    type: 'String', required: true, unique: true, index: true,
  },
  email: {
    type: 'String', required: true, unique: true, index: true,
  },
  password: {
    type: 'String', required: true,
  },
}, { timestamps: true });

export const User = model('User', usersSchema);
