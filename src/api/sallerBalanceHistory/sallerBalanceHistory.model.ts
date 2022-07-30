import * as Mongoose from "mongoose";
import { IBalanceHistory } from "./sallerBalanceHistory.interface";

export const BalanceHistorySchema: Mongoose.Schema<IBalanceHistory> =
  new Mongoose.Schema(
    {
      sellerId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "user_master",
        required: true,
      },
      transactionType: { type: String, required: true },
      openingBalance: { type: Number, required: true },
      closingBalance: { type: Number, required: true },
      transactionAmount: { type: Number, required: true },
      currency: { type: String, required: true },
      paymentInfo: { type: Object, required: true },
      is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
export const BalanceHistoryModel = Mongoose.model<IBalanceHistory>(
  "balance_history_master",
  BalanceHistorySchema
);
