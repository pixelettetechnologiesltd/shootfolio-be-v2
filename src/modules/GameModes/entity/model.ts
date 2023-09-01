import mongoose from "mongoose";
import paginate from "../../../common/plugins/paginate";
import config from "../../../config/config";
import { GameModeAttrs, GameModeDoc, GameModeModel } from "./interface";

const Schema = new mongoose.Schema(
  {
    gameType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameType",
      required: true,
    },
    modeTitle: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    quiz: {
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

Schema.statics.build = (attrs: GameModeAttrs) => {
  return new GameMode(attrs);
};

Schema.pre(["find", "findOne"], async function (done) {
  this.populate("gameType");
  done();
});

const GameMode = mongoose.model<GameModeDoc, GameModeModel>("GameMode", Schema);

export default GameMode;
