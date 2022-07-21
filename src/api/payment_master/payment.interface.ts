import * as Mongoose from "mongoose";

export interface IPayment extends Mongoose.Document {
  orderId?: String;
  userId?: String;
  stripe_txn_id?: String;
  payment_type?: String;
  amount?: Number;
  currency?: String;
  paymentStatus?: String;
  paymentInfo?: Object;
  feeAmount?: Number;
  feePercentage?: Number;
}
