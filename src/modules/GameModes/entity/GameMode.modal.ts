import mongoose from 'mongoose';
import paginate from '../../../common/plugins/paginate';
import { GameModeAttrs, GameModeDoc, GameModeModel } from './interface';

const gameModeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    subscription: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Subscription',
      required: true,
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

gameModeSchema.plugin(paginate);

gameModeSchema.statics.build = (attrs: GameModeAttrs) => {
  return new GameMode(attrs);
};

const GameMode = mongoose.model<GameModeDoc, GameModeModel>(
  'GameMode',
  gameModeSchema
);

export default GameMode;
