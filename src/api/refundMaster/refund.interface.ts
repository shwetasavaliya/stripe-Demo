import * as Mongoose from "mongoose";

export interface IRefund extends Mongoose.Document {
  productId?: Mongoose.Schema.Types.ObjectId;
  customerId?: Mongoose.Schema.Types.ObjectId;
  amount?: Number;
  stripeRefundId?: String;
  stripeChargeId?: String;
  stripeStatus?: String;
}
