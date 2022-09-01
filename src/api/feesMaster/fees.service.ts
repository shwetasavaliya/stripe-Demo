import {
  Model,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  QueryOptions,
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { IFees } from "./fees.interface";
import { FeesModel } from "./feees.model";

export default class FeesService implements IBaseService<IFees> {
  private model: Model<IFees>;

  public constructor() {
    this.model = FeesModel;
  }

  create = async (item: IFees): Promise<IFees> => {
    return this.model.create(item);
  };

  findById = async (
    id: string,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<Nullable<IFees>> => {
    return this.model.findById(id, projection, options);
  };

  findOne = async (
    query: any,
    options: QueryOptions = {},
    projection?: any | null
  ): Promise<Nullable<IFees>> => {
    return this.model.findOne(query, projection, options).lean();
  };

  updateOne = async (
    query: any,
    updateObj: UpdateQuery<IFees>,
    options: QueryFindOneAndUpdateOptions = { new: true, upsert: true }
  ): Promise<Nullable<IFees>> => {
    return this.model.findOneAndUpdate(query, updateObj, options).lean();
  };

  find = async (
    query: FilterQuery<IFees>,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<IFees[]> => {
    return this.model.find(query, projection, options);
  };

  update = async (
    query: any,
    updateObj: UpdateQuery<IFees>
  ): Promise<Nullable<IFees>> => {
    return this.model.findByIdAndUpdate(query, updateObj, { new: true });
  };

  delete = async (query: any): Promise<Nullable<IFees>> => {
    return this.model.findByIdAndRemove("id");
  };

  aggregate = async (pipeline: any[]): Promise<IFees[]> => {
    return this.model.aggregate(pipeline);
  };
}
