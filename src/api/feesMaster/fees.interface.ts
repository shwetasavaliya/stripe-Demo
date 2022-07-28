import * as Mongoose from "mongoose";

export interface IFees extends Mongoose.Document {
  fee_type?: String;
  fee_structure?: Array<Object>;
}
