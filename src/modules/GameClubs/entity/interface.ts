import mongoose from "mongoose";
import {
  Options,
  PaginationResult,
} from "../../../common/interfaces/paginates.interface";

export interface GameClubAttrs {
  gameTypeId: mongoose.Schema.Types.ObjectId;
  title: string;
  logo: string;
  symbol: string;
  status: boolean;
}

export interface GameClubUpdateAttrs {
  gameTypeId: mongoose.Schema.Types.ObjectId;
  title: string;
  logo: string;
  symbol: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface GameClubDoc extends mongoose.Document {
  gameTypeId: mongoose.Schema.Types.ObjectId;
  title: string;
  logo: string;
  symbol: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GameClubModel extends mongoose.Model<GameClubDoc> {
  build(attrs: GameClubAttrs): GameClubDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
