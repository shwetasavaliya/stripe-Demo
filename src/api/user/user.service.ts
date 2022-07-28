import {
    Model,
    FilterQuery,
    UpdateQuery,
    QueryFindOneAndUpdateOptions,
    QueryOptions
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

export default class UserService implements IBaseService<IUser> {
    private model: Model<IUser>;
  
    public constructor() {
        this.model = UserModel;
    }

    create = async (item: IUser): Promise<IUser> => {
        return this.model.create(item);
    };

    findById = async (
        id: string,
        projection: any = {},
        options: QueryOptions = { lean: true }
    ): Promise<Nullable<IUser>> => {
        return this.model.findById(id, projection, options);
    };

    findOne = async (
        query: any,
        options: QueryOptions = {},
        projection?: any | null
    ): Promise<Nullable<IUser>> => {
        return this.model.findOne(query, projection, options).lean();
    };

    updateOne = async (
        query: any,
        updateObj: UpdateQuery<IUser>,
        options: QueryFindOneAndUpdateOptions = { new: true, upsert: true }
    ): Promise<Nullable<IUser>> => {
        return this.model.findOneAndUpdate(query, updateObj, options).lean();
    };

    find = async (
        query: FilterQuery<IUser>,
        projection: any = {},
        options: QueryOptions = { lean: true }
    ): Promise<IUser[]> => {
        return this.model.find(query, projection, options);
    };

    update = async (
        query: any,
        updateObj: UpdateQuery<IUser>
    ): Promise<Nullable<IUser>> => {
        return this.model.findByIdAndUpdate(query, updateObj, { new: true });
    };

    delete = async (query: any): Promise<Nullable<IUser>> => {
        return this.model.findByIdAndRemove('id');
    };

     aggregate = async (pipeline: any[]):Promise<IUser[]>=> {
        return this.model.aggregate(pipeline);
    }
}