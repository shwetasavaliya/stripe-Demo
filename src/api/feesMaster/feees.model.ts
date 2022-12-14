import * as Mongoose from "mongoose";
import { IFees } from "./fees.interface";

export const FeesSchema: Mongoose.Schema<IFees> = new Mongoose.Schema(
  {
    fee_type: { type: String, required: true },
    fee_structure: { type: Array, required: true },
    is_deleted: { type: Boolean, default: false },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export const FeesModel = Mongoose.model<IFees>("fees_master", FeesSchema);
