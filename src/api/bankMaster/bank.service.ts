import {
  Model,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  QueryOptions,
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { IBank } from "./bank.interface";
import { BankModel } from "./bank.model";

export default class BankService implements IBaseService<IBank> {
  private model: Model<IBank>;

  public constructor() {
    this.model = BankModel;
  }

  create = async (item: IBank): Promise<IBank> => {
    return this.model.create(item);
  };

  findById = async (
    id: string,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<Nullable<IBank>> => {
    return this.model.findById(id, projection, options);
  };

  findOne = async (
    query: any,
    options: QueryOptions = {},
    projection?: any | null
  ): Promise<Nullable<IBank>> => {
    return this.model.findOne(query, projection, options).lean();
  };

  updateOne = async (
    query: any,
    updateObj: UpdateQuery<IBank>,
    options: QueryFindOneAndUpdateOptions = { new: true, upsert: true }
  ): Promise<Nullable<IBank>> => {
    return this.model.findOneAndUpdate(query, updateObj, options).lean();
  };

  find = async (
    query: FilterQuery<IBank>,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<IBank[]> => {
    return this.model.find(query, projection, options);
  };

  update = async (
    query: any,
    updateObj: UpdateQuery<IBank>
  ): Promise<Nullable<IBank>> => {
    return this.model.findByIdAndUpdate(query, updateObj, { new: true });
  };

  updateMany = async (query: any, updateObj: any) => {
    return this.model.updateMany(query, updateObj, { new: true });
  };

  delete = async (query: any): Promise<Nullable<IBank>> => {
    return this.model.findByIdAndRemove("id");
  };

  aggregate = async (pipeline: any[]): Promise<IBank[]> => {
    return this.model.aggregate(pipeline);
  };
}
