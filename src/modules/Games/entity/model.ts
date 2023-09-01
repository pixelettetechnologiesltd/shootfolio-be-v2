import mongoose from "mongoose";
import paginate from "../../../common/plugins/paginate";
import {
  GameAttrs,
  GameDoc,
  GameModel,
  GameStatus,
  PlayerRoles,
} from "./interface";
import { number } from "joi";
import User from "../../User/entity/User.model";

const Schema = new mongoose.Schema(
  {
    rival: {
      type: Object,
      required: true,
    },
    challenger: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    rivalClub: {
      type: mongoose.Types.ObjectId,
      Object,
      ref: "GameClub",
      required: true,
    },
    challengerClub: {
      type: mongoose.Types.ObjectId,
      Object,
      ref: "GameClub",
    },
    rivalProtfolios: [
      {
        portfolio: {
          type: mongoose.Types.ObjectId,
          ref: "Portfolio",
        },
        quantity: {
          type: Number,
          default: 0,
        },
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          default: null,
        },
        balance: {
          type: Number,
          default: 0,
        },
        role: {
          type: String,
          default: null,
        },
        ball: {
          type: Boolean,
          default: false,
        },
        borrowAmount: {
          type: Number,
          default: 0,
        },
      },
    ],
    challengerProtfolios: [
      {
        portfolio: {
          type: mongoose.Types.ObjectId,
          ref: "Portfolio",
        },
        quantity: {
          type: Number,
          default: 0,
        },
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          default: null,
        },
        balance: {
          type: Number,
          default: 0,
        },
        role: {
          type: String,
          default: null,
        },
        ball: {
          type: Boolean,
          default: false,
        },
        borrowAmount: {
          type: Number,
          default: 0,
        },
      },
    ],
    rivalBalance: {
      type: Number,
      default: 0,
    },
    challengerBalance: {
      type: Number,
      default: 0,
    },
    gameMode: {
      type: mongoose.Types.ObjectId,
      ref: "GameMode",
      required: true,
    },
    leauge: {
      type: mongoose.Types.ObjectId,
      ref: "GameLeague",
      required: true,
    },
    status: {
      type: String,
      enum: GameStatus,
      required: true,
    },
    rivalGoals: {
      type: Number,
      default: 0,
    },
    challengerGoals: {
      type: Number,
      default: 0,
    },
    winner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["days", "minutes"],
    },
    remainingCamparisons: {
      type: Number,
      default: 0,
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

Schema.statics.build = (attrs: GameAttrs) => {
  return new GameType(attrs);
};

Schema.pre(["find", "findOne"], async function (done) {
  this.populate("challenger")
    .populate("rivalClub")
    .populate("challengerClub")
    .populate("rivalProtfolios.portfolio")
    .populate("rivalProtfolios.user")
    .populate("challengerProtfolios.portfolio")
    .populate("challengerProtfolios.user")
    .populate("gameMode")
    .populate("winner")
    .populate("leauge");
  done();
});

const GameType = mongoose.model<GameDoc, GameModel>("Games", Schema);

export default GameType;
