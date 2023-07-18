import {
  ExtraUpdateOptions,
  FindAndCountAllResponse,
  UpdateResponse
} from '@app/shared/types';
import {
  Aggregate,
  ClientSession,
  FilterQuery,
  ObjectId,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

export interface Write<T> {
	create(payload: Partial<T> | Partial<T>[]): Promise<T | T[]>;

	update(
		fitlerQuery: FilterQuery<T>,
		payload: UpdateQuery<T>,
		options?: QueryOptions<T> & ExtraUpdateOptions,
	): Promise<UpdateResponse>;

	findOneAndUpdate(
		filterQuery?: FilterQuery<T>,
		updateData?: UpdateQuery<T>,
		options?: QueryOptions<T>,
	): Promise<T>;

	findByIdAndUpdate(
		id?: ObjectId,
		updateData?: UpdateQuery<T>,
		options?: QueryOptions<T>,
	): Promise<T>;

	deleteById(id: ObjectId, options?: QueryOptions<T>): Promise<UpdateResponse>;

	deleteMany(
		filterQuery?: FilterQuery<T>,
		options?: QueryOptions<T>,
	): Promise<UpdateResponse>;

	deleteOne(
		filterQuery?: FilterQuery<T>,
		options?: QueryOptions<T>,
	): Promise<UpdateResponse>;

	startTransaction(): Promise<ClientSession>;
}

export interface Read<T> {
	findOne(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<T>;

	findById(
		id: string | ObjectId,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<T>;

	findAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<T[]>;

	findAndCountAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<FindAndCountAllResponse<T>>;

	aggregateBuilder(): Aggregate<any>;
}

export interface IAbstractRepository<T> extends Write<T>, Read<T> {}
