import mongoose from "mongoose";
import paginate from "../../../common/plugins/paginate";
import config from "../../../config/config";
import {
  GameTypeStatus,
  GameTypeAttrs,
  GameTypeDoc,
  GameTypeModel,
} from "./interface";

const Schema = new mongoose.Schema(
  {
    iconUrl: {
      type: String,
      required: true,
    },
    gameTitle: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: GameTypeStatus,
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
        if (ret.iconUrl) {
          ret.iconUrl = config.rootPath + ret.iconUrl;
        }
      },
    },
    timestamps: true,
  }
);
Schema.plugin(paginate);

Schema.statics.build = (attrs: GameTypeAttrs) => {
  return new GameType(attrs);
};

const GameType = mongoose.model<GameTypeDoc, GameTypeModel>("GameType", Schema);

export default GameType;
