import {
  Model,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  QueryOptions,
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { IOrderDetail } from "./orderDetail.interface";
import { OrderDetailModel } from "./orderDetail.model";

export default class OrderDetailService implements IBaseService<IOrderDetail> {
  private model: Model<IOrderDetail>;

  public constructor() {
    this.model = OrderDetailModel;
  }

  create = async (item: IOrderDetail): Promise<IOrderDetail> => {
    return this.model.create(item);
  };

  bulkCreate = async (item: IOrderDetail[]): Promise<IOrderDetail[]> => {
    return this.model.insertMany(item);
  };

  findById = async (
    id: string,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<Nullable<IOrderDetail>> => {
    return this.model.findById(id, projection, options);
  };

  findOne = async (
    query: any,
    options: QueryOptions = {},
    projection?: any | null
  ): Promise<Nullable<IOrderDetail>> => {
    return this.model.findOne(query, projection, options).lean();
  };

  updateOne = async (
    query: any,
    updateObj: UpdateQuery<IOrderDetail>,
    options: QueryFindOneAndUpdateOptions = { new: true, upsert: false }
  ): Promise<Nullable<IOrderDetail>> => {
    return this.model.findOneAndUpdate(query, updateObj, options).lean();
  };

  find = async (
    query: FilterQuery<IOrderDetail>,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<IOrderDetail[]> => {
    return this.model.find(query, projection, options);
  };

  update = async (
    query: any,
    updateObj: UpdateQuery<IOrderDetail>
  ): Promise<Nullable<IOrderDetail>> => {
    return this.model.findByIdAndUpdate(query, updateObj, { new: true });
  };

  updateMany = async (query: any, updateObj: any) => {
    return this.model.updateMany(query, updateObj, { new: true });
  };

  delete = async (query: any): Promise<Nullable<IOrderDetail>> => {
    return this.model.findByIdAndRemove("id");
  };

  aggregate = async (pipeline: any[]): Promise<IOrderDetail[]> => {
    return this.model.aggregate(pipeline);
  };
}
