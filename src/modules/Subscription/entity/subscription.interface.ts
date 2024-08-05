import mongoose from 'mongoose';
import { PaginationResult } from '../../../common/interfaces';
import { Options } from '../../../common/interfaces/paginates.interface';
import { GameLeagueDoc } from '../../GameLeagues/entity/interface';

export enum SubscriptionTypes {
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINIUM = 'Platinum',
  FREE = 'Free',
}
export interface SubscriptionAttrs {
  name: SubscriptionTypes;
  leagues: mongoose.Types.ObjectId[];
  amount: number;
}

export interface SubscriptionDoc extends mongoose.Document {
  name: SubscriptionTypes;
  leagues: GameLeagueDoc[];
  amount: number;
  priceId: string;
  productId: string;
  status: boolean;
}

export interface SubscriptionModel extends mongoose.Model<SubscriptionDoc> {
  build(attrs: Partial<SubscriptionAttrs>): SubscriptionDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
  isSubscriptionNameTaken(name: string): Promise<boolean>;
}
