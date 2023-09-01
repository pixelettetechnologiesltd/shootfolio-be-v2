import mongoose from "mongoose";
import {
  Options,
  PaginationResult,
} from "../../../common/interfaces/paginates.interface";

export interface AdminAttrs {
  email: string;
  password: string;
  name: string;
  userName: string;
  walletAddress: string;
  role?: string;
  active?: boolean;
}

export interface AdminUpdateAttrs {
  id: string;
  email: never;
  password?: string;
  name?: string;
  userName: string;
  walletAddress?: string;
  role?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface AdminDoc extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  userName: string;
  walletAddress: string;
  role: string;
}

export interface AdminModel extends mongoose.Model<AdminDoc> {
  build(attrs: AdminAttrs): AdminDoc;
  isEmailTaken(userName: string): Promise<AdminDoc>;
  paginate(filter: object, options: Options): Promise<PaginationResult>;
}
