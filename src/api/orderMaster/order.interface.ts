import * as Mongoose from "mongoose";

export interface IOrder extends Mongoose.Document {
  orderDetail?: Array<object>;
  customerId?: Mongoose.Schema.Types.ObjectId;
  orderDate?: Date;
  totalAmount?: Number;
}
