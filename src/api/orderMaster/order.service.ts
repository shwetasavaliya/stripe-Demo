import {
  Model,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  QueryOptions,
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";

export default class OrderService implements IBaseService<IOrder> {
  private model: Model<IOrder>;

  public constructor() {
    this.model = OrderModel;
  }

  create = async (item: IOrder): Promise<IOrder> => {
    return this.model.create(item);
  };

  bulkCreate = async (item: IOrder[]): Promise<IOrder[]> => {
    return this.model.insertMany(item);
  };

  findById = async (
    id: string,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<Nullable<IOrder>> => {
    return this.model.findById(id, projection, options);
  };

  findOne = async (
    query: any,
    options: QueryOptions = {},
    projection?: any | null
  ): Promise<Nullable<IOrder>> => {
    return this.model.findOne(query, projection, options).lean();
  };

  updateOne = async (
    query: any,
    updateObj: UpdateQuery<IOrder>,
    options: QueryFindOneAndUpdateOptions = { new: true, upsert: true }
  ): Promise<Nullable<IOrder>> => {
    return this.model.findOneAndUpdate(query, updateObj, options).lean();
  };

  find = async (
    query: FilterQuery<IOrder>,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<IOrder[]> => {
    return this.model.find(query, projection, options);
  };

  update = async (
    query: any,
    updateObj: UpdateQuery<IOrder>
  ): Promise<Nullable<IOrder>> => {
    return this.model.findByIdAndUpdate(query, updateObj, { new: true });
  };

  delete = async (query: any): Promise<Nullable<IOrder>> => {
    return this.model.findByIdAndRemove("id");
  };

  aggregate = async (pipeline: any[]): Promise<IOrder[]> => {
    return this.model.aggregate(pipeline);
  };
}
