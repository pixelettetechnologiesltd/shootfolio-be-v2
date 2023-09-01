import mongoose from 'mongoose';
import {
  Options,
  PaginationResult,
} from '../../../common/interfaces/paginates.interface';
import { SubscriptionDoc } from '../../Subscription/entity/subscription.interface';

export enum CryptoPaymentStatus {
  Pending = 'Pending',
  Reject = 'Reject',
  Approve = 'Approve',
}

export interface CryptoPaymentAttrs {
  subscription: mongoose.Types.ObjectId;
  paymentMethod: string;
  transactionHash: string;
  user: mongoose.Types.ObjectId;
  status: CryptoPaymentStatus;
}
export interface CryptoPaymentDoc extends mongoose.Document {
  subscription: SubscriptionDoc | null;
  paymentMethod: string;
  transactionHash: string;
  user: mongoose.Types.ObjectId;
  status: CryptoPaymentStatus;
}

export interface CryptoPaymentUpdateAttrs {
  status: CryptoPaymentStatus;
}

export interface CryptoPaymentModel extends mongoose.Model<CryptoPaymentDoc> {
  build(attrs: CryptoPaymentAttrs): CryptoPaymentDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
