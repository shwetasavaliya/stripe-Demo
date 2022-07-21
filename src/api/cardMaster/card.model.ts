import * as Mongoose from "mongoose";
import { ICard } from "./card.interface";

export const CardSchema: Mongoose.Schema<ICard> = new Mongoose.Schema({
  customerId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "user_master",
    required: true,
  },
  stripe_card_id: { type: String, required: true },
  fingerprint: { type: String, required: true },
  last_4_digit: { type: Number, required: true },
  exp_date: { type: String, required: true },
  is_default: { type: Boolean, required: true, default: true },
  is_deleted: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  date_created: { type: Date, default: Date.now() },
  date_modified: { type: Date, default: Date.now() },
});

export const CardModel = Mongoose.model<ICard>("card_master", CardSchema);
