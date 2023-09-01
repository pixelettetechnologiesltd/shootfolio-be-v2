import mongoose from 'mongoose';
import {
  Options,
  PaginationResult,
} from '../../../common/interfaces/paginates.interface';

export interface QuizAttrs {
  question: string;
  options: [string];
  correctOption: number;
}

export interface QuizDoc extends mongoose.Document {
  _id?: string;
  question: string;
  options: [string];
  correctOption: number;
}

export interface QuizModal extends mongoose.Model<QuizDoc> {
  build(attrs: QuizAttrs): QuizDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
