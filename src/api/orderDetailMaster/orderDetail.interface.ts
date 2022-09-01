import * as Mongoose from "mongoose";

export interface IOrderDetail extends Mongoose.Document {
  orderId?: String;
  productId?: String;
  amount?: Number;
  status?: String;
  is_transfer?: boolean;
  sellerAmount?: Number;
}
