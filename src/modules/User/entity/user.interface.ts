import mongoose from 'mongoose';
import {
  Options,
  PaginationResult,
} from '../../../common/interfaces/paginates.interface';
import { SubscriptionDoc } from '../../Subscription/entity/subscription.interface';

export interface UserAttrs {
  email: string;
  password: string;
  name: string;
  userName: string;
  walletAddress: string;
  role?: string;
  suspend?: boolean;
  active?: boolean;
  verificationToken?: string;
  isVerified?: boolean;
}

export interface UserUpdateAttrs {
  id: string;
  email: never;
  password?: string;
  name?: string;
  userName: string;
  photoPath?: string;
  walletAddress?: string;
  role?: string;
  suspend?: boolean;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  subscription?: mongoose.Types.ObjectId;
}
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  userName: string;
  walletAddress: string;
  role: string;
  suspend?: boolean;
  active?: boolean;
  deviceToken: string[];
  OTP: { key?: Number | null };
  createdAt?: Date;
  updatedAt?: Date;
  subscription: SubscriptionDoc | null;
  subId: string | null;
  verificationToken: string;
  isVerified: boolean;
}

export interface UserUpdateStatus {
  id: string;
  status: string;
}

export interface updateUserByAdmin {
  name: string;
  userName: string;
}

export interface UserModel extends mongoose.Model<UserDoc> {
  isEmailTaken(email: string): Promise<UserDoc>;
  build(attrs: UserAttrs): UserDoc;
  isUserNameTaken(userName: string): Promise<UserDoc>;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
