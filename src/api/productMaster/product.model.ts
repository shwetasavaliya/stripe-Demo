import * as Mongoose from "mongoose";
import { IProduct } from "./product.interface";

export const ProductSchema: Mongoose.Schema<IProduct> = new Mongoose.Schema(
  {
    sellerId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "registration",
      required: true,
    },
    productName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    is_deleted: { type: Boolean, default: false },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export const ProductModel = Mongoose.model<IProduct>(
  "product_master",
  ProductSchema
);
