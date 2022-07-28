import {
  FilterQuery,
  QueryFindBaseOptions,
  QueryFindOneAndUpdateOptions,
  QueryFindOptions,
  UpdateQuery
} from 'mongoose';
import { Nullable } from '../constants/customTypes';
export interface IBaseService<T> {
  create?: (item: T) => Promise<T>;
  update?: (query: any, updateObj: UpdateQuery<T>) => Promise<Nullable<T>>;
  delete?: (query: any) => Promise<Nullable<T>>;
  find?: (query: FilterQuery<T>, options: QueryFindOptions) => Promise<T[]>;
  findById?: (id: string, options: QueryFindBaseOptions) => Promise<Nullable<T>>;
  updateOne?: (
    query: any,
    updateObj: UpdateQuery<T>,
    options: QueryFindOneAndUpdateOptions
  ) => Promise<Nullable<T>>;
  findOne?: (
    query: any,
    projection: any,
    options: QueryFindBaseOptions
  ) => Promise<Nullable<T>>;
}
