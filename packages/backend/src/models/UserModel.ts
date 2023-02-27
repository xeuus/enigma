import { LoginHistory, Platform, User } from 'interfaces';
import { Schema, model } from 'mongoose';

export const PARTY_USER = 0;

export const LoginHistorySchema = new Schema<LoginHistory>({
  platorm: {
    type: String,
    required: true,
    enum: Object.values(Platform),
  },
  issuedAt: {
    type: Date,
    required: true,
  },
});

export const UserSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  partyType: {
    type: Number,
    default: PARTY_USER,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  loginHistory: {
    type: [LoginHistorySchema],
    default: [],
  },
});

export const UserModel = model('User', UserSchema);

export default UserModel;
