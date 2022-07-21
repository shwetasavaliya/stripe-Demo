import * as Mongoose from "mongoose";

export interface ICard extends Mongoose.Document {
  customerId?: String;
  stripe_card_id?: String;
  fingerprint?: String;
  last_4_digit?: Number;
  exp_date?: String;
  is_default?: Boolean;
}
