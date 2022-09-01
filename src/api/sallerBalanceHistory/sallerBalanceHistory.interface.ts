import * as Mongoose from "mongoose";

export interface IBalanceHistory extends Mongoose.Document {
  sellerId?: Mongoose.Types.ObjectId;
  transactionType?: String;
  openingBalance?: Number;
  closingBalance?: Number;
  transactionAmount?: Number;
  currency?: String;
  paymentInfo?: Object;
}
