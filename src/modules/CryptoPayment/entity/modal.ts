import mongoose from 'mongoose';
import paginate from '../../../common/plugins/paginate';
import config from '../../../config/config';
import { BadRequestError } from '../../../errors/badRequest.error';
import {
  CryptoPaymentAttrs,
  CryptoPaymentDoc,
  CryptoPaymentModel,
  CryptoPaymentStatus,
} from './interface';

const cryptoPaymentSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    paymentMethod: {
      type: String,
      default: null,
      required: true,
    },
    transactionHash: {
      type: String,
      default: null,
      required: true,
    },
    status: {
      type: String,
      enum: CryptoPaymentStatus,
      default: CryptoPaymentStatus.Pending,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {},
    timestamps: true,
  }
);

cryptoPaymentSchema.plugin(paginate);

cryptoPaymentSchema.pre(['find', 'findOne'], async function (done) {
  this.populate('subscription').populate('user');
  done();
});

cryptoPaymentSchema.statics.build = (attrs: CryptoPaymentAttrs) => {
  return new CryptoPayment(attrs);
};

const CryptoPayment = mongoose.model<CryptoPaymentDoc, CryptoPaymentModel>(
  'CryptoPayment',
  cryptoPaymentSchema
);
export default CryptoPayment;
