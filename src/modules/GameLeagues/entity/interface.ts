import mongoose from "mongoose";
import {
  Options,
  PaginationResult,
} from "../../../common/interfaces/paginates.interface";

export interface GameLeagueAttrs {
  gameTypeId: mongoose.Schema.Types.ObjectId;
  gameModeId: mongoose.Schema.Types.ObjectId;
  leagueTitle: string;
  investableBudget: number;
  status: boolean;
  borrowAmount: number;
}

export interface GameLeagueUpdateAttrs {
  gameTypeId: mongoose.Schema.Types.ObjectId;
  gameModeId: mongoose.Schema.Types.ObjectId;
  leagueTitle: string;
  investableBudget: number;
  status: boolean;
  borrowAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface GameLeagueDoc extends mongoose.Document {
  gameTypeId: mongoose.Schema.Types.ObjectId;
  gameModeId: mongoose.Schema.Types.ObjectId;
  leagueTitle: string;
  investableBudget: number;
  status: boolean;
  borrowAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GameLeagueModel extends mongoose.Model<GameLeagueDoc> {
  build(attrs: GameLeagueAttrs): GameLeagueDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
