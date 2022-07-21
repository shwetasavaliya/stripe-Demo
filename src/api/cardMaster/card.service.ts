import {
    Model,
    FilterQuery,
    UpdateQuery,
    QueryFindOneAndUpdateOptions,
    QueryOptions
} from "mongoose";
import { IBaseService } from "src/baseService/baseService.interface";
import { Nullable } from "src/constants/customTypes";
import { ICard } from "./card.interface";
import { CardModel } from "./card.model";

export default class CardService implements IBaseService<ICard> {
    private model: Model<ICard>;
  
    public constructor() {
        this.model = CardModel;
    }

    create = async (item: ICard): Promise<ICard> => {
        return this.model.create(item);
    };

    findById = async (
        id: string,
        projection: any = {},
        options: QueryOptions = { lean: true }
    ): Promise<Nullable<ICard>> => {
        return this.model.findById(id, projection, options);
    };

    findOne = async (
        query: any,
        options: QueryOptions = {},
        projection?: any | null
    ): Promise<Nullable<ICard>> => {
        return this.model.findOne(query, projection, options).lean();
    };

    updateOne = async (
        query: any,
        updateObj: UpdateQuery<ICard>,
        options: QueryFindOneAndUpdateOptions = { new: true, upsert: true }
    ): Promise<Nullable<ICard>> => {
        return this.model.findOneAndUpdate(query, updateObj, options).lean();
    };

    find = async (
        query: FilterQuery<ICard>,
        projection: any = {},
        options: QueryOptions = { lean: true }
    ): Promise<ICard[]> => {
        return this.model.find(query, projection, options);
    };

    update = async (
        query: any,
        updateObj: UpdateQuery<ICard>
    ): Promise<Nullable<ICard>> => {
        return this.model.findByIdAndUpdate(query, updateObj, { new: true });
    };

    delete = async (query: any): Promise<Nullable<ICard>> => {
        return this.model.findByIdAndRemove('id');
    };

     aggregate = async (pipeline: any[]):Promise<ICard[]>=> {
        return this.model.aggregate(pipeline);
    }
}