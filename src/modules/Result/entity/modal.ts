import mongoose from 'mongoose';
import paginate from '../../../common/plugins/paginate';
import { ResultDoc, ResultAttrs, ResultModal } from './interface';

const resultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    quiz: {
      type: mongoose.Types.ObjectId,
      ref: 'Quiz',
    },
    status: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
resultSchema.plugin(paginate);

resultSchema.statics.build = (attrs: ResultAttrs) => {
  return new Result(attrs);
};
// const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
const Result = mongoose.model<ResultDoc, ResultModal>('Result', resultSchema);

export default Result;
