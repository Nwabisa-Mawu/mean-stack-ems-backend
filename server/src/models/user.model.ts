import mongoose, { Schema } from 'mongoose';
import { User } from '../interfaces/user';

const userSchema = new Schema<User>({
  username: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<User>('User', userSchema);