import mongoose from "mongoose";
import {
  Options,
  PaginationResult,
} from "../../../common/interfaces/paginates.interface";

export interface GameModeAttrs {
  gameType: mongoose.Schema.Types.ObjectId;
  modeTitle: string;
  duration: string,
  status: boolean;
  quiz: boolean;
}

export interface GameModeUpdateAttrs {
  gameType: mongoose.Schema.Types.ObjectId;
  modeTitle: string;
  duration: string,
  status: boolean;
  quiz: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface GameModeDoc extends mongoose.Document {
  gameType: mongoose.Schema.Types.ObjectId;
  modeTitle: string;
  duration: string,
  status: boolean;
  quiz: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GameModeModel extends mongoose.Model<GameModeDoc> {
  build(attrs: GameModeAttrs): GameModeDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
