import mongoose from "mongoose";
import paginate from "../../../common/plugins/paginate";
import config from "../../../config/config";
import { GameLeagueAttrs, GameLeagueDoc, GameLeagueModel } from "./interface";

const Schema = new mongoose.Schema(
  {
    gameTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameType",
      required: true,
    },
    gameModeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameMode",
      required: true,
    },
    leagueTitle: {
      type: String,
      required: true,
    },
    investableBudget: {
      type: Number,
      required: true,
    },
    borrowAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
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

Schema.statics.build = (attrs: GameLeagueAttrs) => {
  return new GameLeague(attrs);
};

Schema.pre(["find", "findOne"], async function (done) {
  this.populate("gameTypeId").populate("gameModeId");
  done();
});

const GameLeague = mongoose.model<GameLeagueDoc, GameLeagueModel>(
  "GameLeague",
  Schema
);

export default GameLeague;
