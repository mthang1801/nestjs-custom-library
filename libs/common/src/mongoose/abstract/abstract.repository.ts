import { MongooseClassSerialzierInterceptor } from '@app/common/interceptors';
import { Posts } from '@app/common/schemas';
import { FindAllResponse, RemoveOptions } from '@app/common/types';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import {
  Aggregate,
  ClientSession,
  FilterQuery,
  HydratedDocument,
  Model,
  ObjectId,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import utils from '../../utils';
import { AbstractSchema } from './abstract.schema';

@Injectable()
@UseInterceptors(MongooseClassSerialzierInterceptor(Posts))
export abstract class AbstractRepository<
	T extends HydratedDocument<Document, AbstractSchema>,
> {
	protected abstract readonly logger: Logger;
	protected primaryModel: Model<T> = null;
	protected secondaryModel: Model<T> = null;
	private aggregate: Aggregate<any> = null;

	constructor(primaryModel: Model<T>, secondaryModel: Model<T>) {
		this.primaryModel = primaryModel;
		this.secondaryModel = secondaryModel;
	}

	async startTransaction(): Promise<ClientSession> {
		const session = await this.primaryModel.startSession();
		session.startTransaction();
		return session;
	}

	async create(payload: Partial<T> | Partial<T>[]): Promise<T> {
		return this.primaryModel.create(payload);
	}

	async findOne(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<T> {
		if (utils.typeOf(projection) === 'string')
			return this.secondaryModel
				.findOne(filterQuery, {
					lean: true,
					...options,
				})
				.select(projection)
				.exec();

		return this.secondaryModel
			.findOne(filterQuery, projection, {
				lean: true,
				...options,
			})
			.exec();
	}

	async findById(
		id: string | ObjectId,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<T> {
		const result = await this.secondaryModel.findById(id, projection, {
			...options,
		});
		return result.deleted_at ? null : result;
	}

	async find(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<FindAllResponse<T>> {
		const [items, count] = await Promise.all([
			this.secondaryModel
				.find({ ...filterQuery, deleted_at: null }, projection, options)
				.allowDiskUse(true),
			this.secondaryModel.count({ ...filterQuery, deleted_at: null }),
		]);
		return {
			items,
			count,
		};
	}

	async findOneAndUpdate(
		filterQuery?: FilterQuery<T>,
		updateData?: UpdateQuery<T>,
		options?: QueryOptions<T>,
	): Promise<T> {
		return this.primaryModel.findOneAndUpdate(filterQuery, updateData, {
			new: true,
			upsert: true,
			...options,
		});
	}

	async deleteMany(filterQuery?: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.primaryModel.deleteMany(filterQuery, options);
	}

	async deleteOne(filterQuery?: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.primaryModel.deleteOne(filterQuery, options);
	}

	async findOneAndDelete(
		filterQuery: FilterQuery<T>,
		options?: RemoveOptions,
	): Promise<T> {
		if (options?.permanently) {
			return this.primaryModel.findOneAndDelete(filterQuery);
		}
		return this.primaryModel.findOneAndUpdate(filterQuery, {
			$set: { deleted_at: new Date() },
		});
	}

	aggregateBuilder() {
		return (
			this.aggregate ??
			(this.aggregate = this.secondaryModel.aggregate().allowDiskUse(true))
		);
	}
}
