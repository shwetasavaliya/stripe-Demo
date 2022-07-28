import * as Mongoose from "mongoose";
import { IRefund } from "./refund.interface";

export const RefundSchema: Mongoose.Schema<IRefund> = new Mongoose.Schema({
  productId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "product_master",
    required: true,
  },
  customerId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "user_master",
    required: true,
  },
  amount: { type: Number, required: true },
  stripeRefundId: { type: String, required: true },
  stripeChargeId: { type: String, required: true },
  stripeStatus: { type: String, required: true, default: "pending" },
  is_deleted: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  date_created: { type: Date, default: Date.now() },
  date_modified: { type: Date, default: Date.now() },
});

export const RefundModel = Mongoose.model<IRefund>(
  "refund_master",
  RefundSchema
);
