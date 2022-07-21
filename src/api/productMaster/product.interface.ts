import * as Mongoose from "mongoose";

export interface IProduct extends Mongoose.Document {
  sellerId?: String;
  productName?: String;
  description?: String;
  price?: Number;
}
