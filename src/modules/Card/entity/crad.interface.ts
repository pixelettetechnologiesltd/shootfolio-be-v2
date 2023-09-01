import mongoose from 'mongoose';
import {
  Options,
  PaginationResult,
} from '../../../common/interfaces/paginates.interface';
import { UserDoc } from '../../User/entity/user.interface';

export interface CardAttrs {
  customer_id: string;
  subscription_id: string | null;
  payment_id: string;
  user: mongoose.Types.ObjectId;
  city?: string;
  line1?: string;
  line2?: string;
  postal_code: string;
  state?: string;
  country?: string;
  name?: string;
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: string;
  type: string;
}

export interface CardUpdateAttrs {
  customer_id: string;
  subscription_id: string | null;
  payment_id: string;
  user: mongoose.Types.ObjectId;
  address?: {
    city?: string;
    line1?: string;
    line2?: string;
    postal_code: string;
    state?: string;
    country?: string;
  };
  card: {
    name?: string;
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
    type: string;
  };
}
export interface CardDoc extends mongoose.Document {
  customer_id: string;
  subscription_id: string | null;
  payment_id: string;
  user: UserDoc;
  address?: {
    city?: string;
    line1?: string;
    line2?: string;
    postal_code: string;
    state?: string;
    country?: string;
  };
  card: {
    name?: string;
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
    type: string;
  };
}

export interface CardModel extends mongoose.Model<CardDoc> {
  build(attrs: CardAttrs): CardDoc;
  isCardTaken(number: string): Promise<boolean>;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
