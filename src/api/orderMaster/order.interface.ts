import * as Mongoose from "mongoose";

export interface IOrder extends Mongoose.Document {
  orderDetail?: Array<object>;
  customerId?: String;
  orderDate?: Date;
  totalAmount?: Number;
}
