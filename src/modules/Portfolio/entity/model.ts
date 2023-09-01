import mongoose from "mongoose";
import paginate from "../../../common/plugins/paginate";
import config from "../../../config/config";
import {
  PortolioAttrs,
  PortolioDoc,
  PortolioModel,
  PlayerType,
} from "./interface";

const Schema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    club: {
      type: mongoose.Types.ObjectId,
      ref: "GameClub",
      default: null,
    },
    playerType: {
      type: String,
      enum: PlayerType,
      default: PlayerType.Bot,
    },
    coin: {
      type: mongoose.Types.ObjectId,
      ref: "CryptoCoins",
      required: true,
    },
    quantity: {
      type: Number,
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

Schema.statics.build = (attrs: PortolioAttrs) => {
  return new Portfolio(attrs);
};

Schema.pre(["find", "findOne"], async function (done) {
  this.populate("admin").populate("user").populate("coin").populate("club");
});

const Portfolio = mongoose.model<PortolioDoc, PortolioModel>(
  "Portfolio",
  Schema
);

export default Portfolio;
