import {
  Model,
  FilterQuery,
  UpdateQuery,
  QueryFindOneAndUpdateOptions,
  QueryOptions,
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { IPayment } from "./payment.interface";
import { PaymentModel } from "./payment.model";

export default class PaymentService implements IBaseService<IPayment> {
  private model: Model<IPayment>;

  public constructor() {
    this.model = PaymentModel;
  }

  create = async (item: IPayment): Promise<IPayment> => {
    return this.model.create(item);
  };

  bulkCreate = async (item: IPayment[]): Promise<IPayment[]> => {
    return this.model.insertMany(item);
  };

  findById = async (
    id: string,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<Nullable<IPayment>> => {
    return this.model.findById(id, projection, options);
  };

  findOne = async (
    query: any,
    options: QueryOptions = {},
    projection?: any | null
  ): Promise<Nullable<IPayment>> => {
    return this.model.findOne(query, projection, options).lean();
  };

  updateOne = async (
    query: any,
    updateObj: UpdateQuery<IPayment>,
    options: QueryFindOneAndUpdateOptions = { new: true, upsert: true }
  ): Promise<Nullable<IPayment>> => {
    return this.model.findOneAndUpdate(query, updateObj, options).lean();
  };

  find = async (
    query: FilterQuery<IPayment>,
    projection: any = {},
    options: QueryOptions = { lean: true }
  ): Promise<IPayment[]> => {
    return this.model.find(query, projection, options);
  };

  update = async (
    query: any,
    updateObj: UpdateQuery<IPayment>
  ): Promise<Nullable<IPayment>> => {
    return this.model.findByIdAndUpdate(query, updateObj, { new: true });
  };

  updateMany = async (query: any, updateObj: any) => {
    return this.model.updateMany(query, updateObj, { new: true });
  };

  delete = async (query: any): Promise<Nullable<IPayment>> => {
    return this.model.findByIdAndRemove("id");
  };

  aggregate = async (pipeline: any[]): Promise<IPayment[]> => {
    return this.model.aggregate(pipeline);
  };
}
