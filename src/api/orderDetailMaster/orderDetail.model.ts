import * as Mongoose from "mongoose";
import { IOrderDetail } from "./orderDetail.interface";

export const OrderDetailSchema: Mongoose.Schema<IOrderDetail> =
  new Mongoose.Schema(
    {
      orderId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "order_master",
        required: true,
      },
      productId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "product_master",
        required: true,
      },
      amount: { type: Number, required: true },
      status: { type: String, enum: ["purchase", "retrun"] },
      is_deleted: { type: Boolean, default: false },
      date_modified: { type: Date, default: Date.now() },
      is_transfer: { type: Boolean, required: true, default: false },
      sellerAmount: { type: Number, required: true },
    },
    { timestamps: true }
  );

export const OrderDetailModel = Mongoose.model<IOrderDetail>(
  "order_detail_master",
  OrderDetailSchema
);
