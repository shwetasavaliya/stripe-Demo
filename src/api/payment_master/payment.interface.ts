import * as Mongoose from "mongoose";

export interface IPayment extends Mongoose.Document {
  orderId?: Mongoose.Schema.Types.ObjectId;
  userId?: Mongoose.Schema.Types.ObjectId;
  stripe_txn_id?: String;
  payment_type?: String;
  amount?: Number;
  currency?: String;
  paymentStatus?: String;
  paymentInfo?: Object;
  feeAmount?: Number;
  feePercentage?: Number;
}
