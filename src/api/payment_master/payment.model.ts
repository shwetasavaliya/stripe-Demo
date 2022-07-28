import * as Mongoose from "mongoose";
import { IPayment } from "./payment.interface";

export const PaymentSchema: Mongoose.Schema<IPayment> = new Mongoose.Schema({
  orderId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "order_master",
    required: true,
  },

  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "user_master",
    required: true,
  },
  stripe_txn_id: { type: String, required: false, default: null },
  payment_type: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentStatus: { type: String, required: true, default: "pending" },
  paymentInfo: { type: Object, required: false },
  feeAmount: { type: Number, required: true, default: 0 },
  feePercentage: { type: Number, required: true, default: 0 },
  status: { type: String, default: "active" },
  date_created: { type: Date, default: Date.now() },
  date_modified: { type: Date, default: Date.now() },
});

export const PaymentModel = Mongoose.model<IPayment>(
  "payment_master",
  PaymentSchema
);
