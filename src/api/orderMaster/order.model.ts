import * as Mongoose from "mongoose";
import { IOrder } from "./order.interface";

export const OrderSchema: Mongoose.Schema<IOrder> = new Mongoose.Schema(
  {
    orderDetail: [
      {
        productId: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: "product_master",
          required: true,
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    customerId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "user_master",
      required: true,
    },
    orderDate: { type: Date, required: true, default: Date.now() },
    totalAmount: { type: Number, required: true },
    is_deleted: { type: Boolean, default: false },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export const OrderModel = Mongoose.model<IOrder>("order_master", OrderSchema);
