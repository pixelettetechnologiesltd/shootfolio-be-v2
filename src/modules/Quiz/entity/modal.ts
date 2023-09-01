import mongoose from 'mongoose';
import paginate from '../../../common/plugins/paginate';
import { QuizDoc, QuizAttrs, QuizModal } from './interface';

const quizSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (options: string | any[]) {
          return options.length === 4;
        },
        message: 'Options must contain exactly 4 values.',
      },
    },
    correctOption: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
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
quizSchema.plugin(paginate);

quizSchema.statics.build = (attrs: QuizAttrs) => {
  return new Quiz(attrs);
};
// const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
const Quiz = mongoose.model<QuizDoc, QuizModal>('Quiz', quizSchema);

export default Quiz;
