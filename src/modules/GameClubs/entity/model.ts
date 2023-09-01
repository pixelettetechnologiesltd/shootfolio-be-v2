import mongoose from "mongoose";
import paginate from "../../../common/plugins/paginate";
import config from "../../../config/config";
import { GameClubAttrs, GameClubDoc, GameClubModel } from "./interface";

const Schema = new mongoose.Schema(
  {
    gameTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameType",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    // toJSON: {
    //   transform(doc, ret) {
    //     ret.id = ret._id;
    //     delete ret._id;
    //     delete ret.__v;
    //     delete ret.updatedAt;
    //     if (ret.logo) {
    //       ret.logo = config.rootPath + ret.logo;
    //     }
    //   },
    // },
    timestamps: true,
  }
);
Schema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.updatedAt;

    if (ret.logo && !ret.logo.startsWith(config.rootPath)) {
      ret.logo = config.rootPath + ret.logo;
    }
  },
});
Schema.plugin(paginate);

Schema.statics.build = (attrs: GameClubAttrs) => {
  return new GameClub(attrs);
};
Schema.pre(["find", "findOne"], async function (done) {
  this.populate("gameTypeId");
  done();
});

// Schema.pre("save",async (done) => {
//   if(this.findOne({symbol}))
// })
const GameClub = mongoose.model<GameClubDoc, GameClubModel>("GameClub", Schema);

export default GameClub;
