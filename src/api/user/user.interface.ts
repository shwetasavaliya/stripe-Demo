import * as Mongoose from "mongoose";

export interface IUser extends Mongoose.Document {
  firstName?: String;
  lastName?: String;
  email?: String;
  password?: String;
  address?: String;
  phoneNo?: String;
  userImage?: String;
  role?: String;
  stp_cust_id?: String;
  stp_account_id?: String;
  stp_account_status?: String;
}
