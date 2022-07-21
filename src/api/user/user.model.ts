import * as Mongoose from "mongoose";
import { IUser } from "./user.interface";

export const UsersSchema: Mongoose.Schema<IUser> = new Mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  address: { type: String },
  phoneNo: { type: String, required: true },
  userImage: { type: String },
  role: { type: String, enum: ["seller", "customer"], required: true },
  stp_cust_id: { type: String, default: null },
  stp_account_id: { type: String, default: null },
  stp_account_status: { type: String, default: null },
  is_deleted: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  date_created: { type: Date, default: Date.now() },
  date_modified: { type: Date, default: Date.now() },
});

export const UserModel = Mongoose.model<IUser>("user_master", UsersSchema);
