import mongoose from 'mongoose';
import paginate from '../../../common/plugins/paginate';
import { CardDoc, CardModel, CardAttrs } from './crad.interface';

const creditCardSchema = new mongoose.Schema(
  {
    customer_id: {
      type: String,
      required: true,
    },
    subscription_id: {
      type: String,
      default: null,
    },
    payment_id: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    address: {
      city: {
        type: String,
      },
      line1: {
        type: String,
      },
      line2: {
        type: String,
      },
      postal_code: {
        type: String,
      },

      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    card: {
      name: {
        type: String,
        default: null,
      },
      number: {
        type: String,
        required: true,
      },
      exp_month: {
        type: Number,
        required: true,
      },
      exp_year: {
        type: Number,
        required: true,
      },
      cvc: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['Credit', 'Debit'],
      },
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.card['exp_month'];
        delete ret.card['exp_year'];
        delete ret.card['cvc'];
        delete ret.customer_id;
        delete ret.subscription_id;
        delete ret.payment_id;
      },
    },
    timestamps: true,
  },
);
creditCardSchema.plugin(paginate);
creditCardSchema.statics.build = (attrs: CardAttrs) => {
  return new Card(attrs);
};

creditCardSchema.statics.isCardTaken = async function (number: string) {
  const card = await this.findOne({ 'card.number': number });
  return !!card;
};

const Card = mongoose.model<CardDoc, CardModel>('Card', creditCardSchema);
export default Card;
