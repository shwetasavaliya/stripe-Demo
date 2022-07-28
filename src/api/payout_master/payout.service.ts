import {
  Model,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  QueryOptions,
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { IPayout } from "./payout.interface";
import { PayoutModel } from "./payout.model";
export default class PayoutService implements IBaseService<IPayout> {
  private model: Model<IPayout>;

  public constructor() {
    this.model = PayoutModel;
  }

  create = async (item: IPayout): Promise<IPayout> => {
    return this.model.create(item);
  };

  findById = async (
    id: string,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<Nullable<IPayout>> => {
    return this.model.findById(id, projection, options);
  };

  findOne = async (
    query: any,
    options: QueryOptions = {},
    projection?: any | null
  ): Promise<Nullable<IPayout>> => {
    return this.model.findOne(query, projection, options).lean();
  };

  updateOne = async (
    query: any,
    updateObj: UpdateQuery<IPayout>,
    options: QueryFindOneAndUpdateOptions = { new: true, upsert: true }
  ): Promise<Nullable<IPayout>> => {
    return this.model.findOneAndUpdate(query, updateObj, options).lean();
  };

  find = async (
    query: FilterQuery<IPayout>,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<IPayout[]> => {
    return this.model.find(query, projection, options);
  };

  update = async (
    query: any,
    updateObj: UpdateQuery<IPayout>
  ): Promise<Nullable<IPayout>> => {
    return this.model.findByIdAndUpdate(query, updateObj, { new: true });
  };

  delete = async (query: any): Promise<Nullable<IPayout>> => {
    return this.model.findByIdAndRemove("id");
  };

  aggregate = async (pipeline: any[]): Promise<IPayout[]> => {
    return this.model.aggregate(pipeline);
  };
}
