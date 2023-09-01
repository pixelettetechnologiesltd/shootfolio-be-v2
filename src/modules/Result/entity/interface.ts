import mongoose from 'mongoose';
import {
  Options,
  PaginationResult,
} from '../../../common/interfaces/paginates.interface';

export interface ResultAttrs {
  quiz: mongoose.Types.ObjectId | null;
  user: mongoose.Types.ObjectId | null;
  status: string;
}

export interface ResultDoc extends mongoose.Document {
  quiz: mongoose.Types.ObjectId | null;
  user: mongoose.Types.ObjectId | null;
  status: string;
}

export interface ResultModal extends mongoose.Model<ResultDoc> {
  build(attrs: ResultAttrs): ResultDoc;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
