import * as Mongoose from "mongoose";

export interface IPayout extends Mongoose.Document {
  sellerId?: Mongoose.Schema.Types.ObjectId;
  stripePayoutId?: String;
  destinationId?: String;
  paymentAmount?: Number;
  currency?: String;
  arrival_date?: String;
  stripe_status?: String;
}
