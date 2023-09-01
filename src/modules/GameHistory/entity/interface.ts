import mongoose from "mongoose";
import {
  Options,
  PaginationResult,
} from "../../../common/interfaces/paginates.interface";
import { GameDoc } from "../../Games/entity/interface";
import { UserDoc } from "../../User/entity/user.interface";
import { AdminDoc } from "../../Admin/entity/admin.interface";

export enum PlayerTeam {
  Challenger = "challenger",
  Rival = "rival",
}
export interface GameHistoryttrs {
  game: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  player: PlayerTeam;
  text: string;
}

export interface GameHistoryDoc extends mongoose.Document {
  game: GameDoc;
  user: UserDoc | AdminDoc;
  player: PlayerTeam;
  text: string;
}

export interface GameHistoryModel extends mongoose.Model<GameHistoryDoc> {
  build(attrs: GameHistoryttrs): GameHistoryDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
