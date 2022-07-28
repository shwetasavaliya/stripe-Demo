import * as Mongoose from "mongoose";
import { IPayout } from "./payout.interface";

export const PayoutSchema: Mongoose.Schema<IPayout> = new Mongoose.Schema({
  sellerId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "registration",
    required: true,
  },
  stripePayoutId: { type: String, required: true },
  destinationId: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
  currency: { type: String, required: true },
  arrival_date: { type: String, required: true },
  stripe_status: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  date_created: { type: Date, default: Date.now() },
  date_modified: { type: Date, default: Date.now() },
});

export const PayoutModel = Mongoose.model<IPayout>(
  "payout_master",
  PayoutSchema
);
