import { Logger } from '@nestjs/common';
import {
  Aggregate,
  ClientSession,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import utils from '../utils';

export abstract class AbstractRepository<T extends Document> {
	protected abstract logger: Logger;
	protected primaryModel: Model<T> = null;
	protected secondaryModel: Model<T> = null;
	protected aggregate: Aggregate<any> = null;
	constructor(primaryModel: Model<T>, secondaryModel: Model<T>) {
		this.primaryModel = primaryModel;
		this.secondaryModel = secondaryModel;
	}

	async startTransaction(): Promise<ClientSession> {
		const session = await this.primaryModel.startSession();
		session.startTransaction();
		return session;
	}

	async create(payload: Partial<T> | Partial<T>[]) {
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

	async find(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<T[]> {
		return this.secondaryModel
			.find(filterQuery, projection, { lean: true, ...options })
			.allowDiskUse(true)
			.exec();
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

	aggregateBuilder() {
		return (
			this.aggregate ??
			(this.aggregate = this.secondaryModel.aggregate().allowDiskUse(true))
		);
	}
}
