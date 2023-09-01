import mongoose from "mongoose";
import paginate from "../../../common/plugins/paginate";
import config from "../../../config/config";
import {
  GameHistoryDoc,
  GameHistoryModel,
  GameHistoryttrs,
  PlayerTeam,
} from "./interface";

const Schema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Games",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    player: {
      type: String,
      enum: PlayerTeam,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);
Schema.plugin(paginate);

Schema.statics.build = (attrs: GameHistoryttrs) => {
  return new GameHistory(attrs);
};

Schema.pre(["find", "findOne"], async function (done) {
  this.populate("game").populate("user");
  done();
});

const GameHistory = mongoose.model<GameHistoryDoc, GameHistoryModel>(
  "GameHistory",
  Schema
);

export default GameHistory;
