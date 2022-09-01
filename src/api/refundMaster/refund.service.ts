import {
  Model,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  QueryOptions,
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { IRefund } from "./refund.interface";
import { RefundModel } from "./refund.model";
export default class RefundService implements IBaseService<IRefund> {
  private model: Model<IRefund>;

  public constructor() {
    this.model = RefundModel;
  }

  create = async (item: IRefund): Promise<IRefund> => {
    return this.model.create(item);
  };

  findById = async (
    id: string,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<Nullable<IRefund>> => {
    return this.model.findById(id, projection, options);
  };

  findOne = async (
    query: any,
    options: QueryOptions = {},
    projection?: any | null
  ): Promise<Nullable<IRefund>> => {
    return this.model.findOne(query, projection, options).lean();
  };

  updateOne = async (
    query: any,
    updateObj: UpdateQuery<IRefund>,
    options: QueryFindOneAndUpdateOptions = { new: true, upsert: true }
  ): Promise<Nullable<IRefund>> => {
    return this.model.findOneAndUpdate(query, updateObj, options).lean();
  };

  find = async (
    query: FilterQuery<IRefund>,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<IRefund[]> => {
    return this.model.find(query, projection, options);
  };

  update = async (
    query: any,
    updateObj: UpdateQuery<IRefund>
  ): Promise<Nullable<IRefund>> => {
    return this.model.findByIdAndUpdate(query, updateObj, { new: true });
  };

  delete = async (query: any): Promise<Nullable<IRefund>> => {
    return this.model.findByIdAndRemove("id");
  };

  aggregate = async (pipeline: any[]): Promise<IRefund[]> => {
    return this.model.aggregate(pipeline);
  };
}
