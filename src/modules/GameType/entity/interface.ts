import mongoose from "mongoose";
import {
  Options,
  PaginationResult,
} from "../../../common/interfaces/paginates.interface";

export enum GameTypeStatus {
  Active = "Active",
  InActive = "InActive",
  CommingSoon = "CommingSoon",
}
export interface GameTypeAttrs {
  iconUrl: string;
  gameTitle: string;
  quizAccess: string;
  status: GameTypeStatus;
}

export interface GameTypeUpdateAttrs {
  iconUrl: string;
  gameTitle: string;
  quizAccess: string;
  status: GameTypeStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface GameTypeDoc extends mongoose.Document {
  iconUrl: string;
  gameTitle: string;
  quizAccess: string;
  status: GameTypeStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GameTypeModel extends mongoose.Model<GameTypeDoc> {
  build(attrs: GameTypeAttrs): GameTypeDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
