import * as Mongoose from "mongoose";
import { IBank } from "./bank.interface";

export const BankSchema: Mongoose.Schema<IBank> = new Mongoose.Schema(
  {
    sellerId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "user_master",
      required: true,
    },
    stripeBankAccountId: { type: String, required: true },
    bankName: { type: String, required: true },
    fingerprint: { type: String, required: true },
    last_4_digit: { type: Number, required: true },
    accountHolderName: { type: String, required: true },
    accountHolderType: { type: String, required: true },
    routingNumber: { type: String, required: true },
    is_default: { type: Boolean, required: true, default: true },
    is_deleted: { type: Boolean, default: false },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export const BankModel = Mongoose.model<IBank>("bank_master", BankSchema);
