import {
  Model,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  QueryOptions,
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { IBalanceHistory } from "./sallerBalanceHistory.interface";
import { BalanceHistoryModel } from "./sallerBalanceHistory.model";

export default class BalanceHistoryService
  implements IBaseService<IBalanceHistory>
{
  private model: Model<IBalanceHistory>;

  public constructor() {
    this.model = BalanceHistoryModel;
  }

  create = async (item: IBalanceHistory): Promise<IBalanceHistory> => {
    return this.model.create(item);
  };

  bulkCreate = async (item: IBalanceHistory[]): Promise<IBalanceHistory[]> => {
    return this.model.insertMany(item);
  };

  findById = async (
    id: string,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<Nullable<IBalanceHistory>> => {
    return this.model.findById(id, projection, options);
  };

  findOne = async (
    query: any,
    options: QueryOptions = {},
    projection?: any | null
  ): Promise<Nullable<IBalanceHistory>> => {
    return this.model.findOne(query, projection, options).lean();
  };

  updateOne = async (
    query: any,
    updateObj: UpdateQuery<IBalanceHistory>,
    options: QueryFindOneAndUpdateOptions = { new: true, upsert: false }
  ): Promise<Nullable<IBalanceHistory>> => {
    return this.model.findOneAndUpdate(query, updateObj, options).lean();
  };

  find = async (
    query: FilterQuery<IBalanceHistory>,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<IBalanceHistory[]> => {
    return this.model.find(query, projection, options);
  };

  update = async (
    query: any,
    updateObj: UpdateQuery<IBalanceHistory>
  ): Promise<Nullable<IBalanceHistory>> => {
    return this.model.findByIdAndUpdate(query, updateObj, { new: true });
  };

  delete = async (query: any): Promise<Nullable<IBalanceHistory>> => {
    return this.model.findByIdAndRemove("id");
  };

  aggregate = async (pipeline: any[]): Promise<IBalanceHistory[]> => {
    return this.model.aggregate(pipeline);
  };
}
