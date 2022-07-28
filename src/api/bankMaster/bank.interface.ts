import * as Mongoose from "mongoose";

export interface IBank extends Mongoose.Document {
  sellerId?: String;
  stripeBankAccountId?: String;
  bankName?: String;
  fingerprint?: String;
  last4Digit?: Number;
  accountHolderName?: String;
  accountHolderType?: String;
  routingNumber?: String;
  isDefault?: Boolean;
}
