import mongoose from "mongoose";
import {
  Options,
  PaginationResult,
} from "../../../common/interfaces/paginates.interface";

import { CoinsDoc } from "../../CryptoCoins/entity/interface";

export enum PlayerType {
  Real = "Real",
  Bot = "Bot",
}
export interface PortolioAttrs {
  admin: mongoose.Types.ObjectId | null;
  user: mongoose.Types.ObjectId | null;
  club: mongoose.Types.ObjectId;
  coin: mongoose.Types.ObjectId;
  quantity: number;
  playerType: PlayerType;
}

export interface PortolioUpdateAttrs {
  admin: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  playerType: PlayerType;
  coin: mongoose.Types.ObjectId;
  quantity: number;
  club: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface PortolioDoc extends mongoose.Document {
  admin: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  club: mongoose.Types.ObjectId;
  playerType: PlayerType;
  coin: CoinsDoc;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PortolioModel extends mongoose.Model<PortolioDoc> {
  build(attrs: PortolioAttrs): PortolioDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
