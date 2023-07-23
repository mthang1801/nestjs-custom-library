import {
	AbstractSchema,
	ExtraUpdateOptions,
	ModelInfo,
	UpdateResponse,
} from '@app/shared';

import { Injectable, Logger } from '@nestjs/common';
import {
	FilterQuery,
	HydratedDocument,
	Model,
	ObjectId,
	ProjectionType,
	QueryOptions,
	UpdateQuery,
} from 'mongoose';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export abstract class AbstractService<
	T extends HydratedDocument<Document, AbstractSchema>,
> {
	protected abstract logger: Logger;
	protected writeModel: Model<T> = null;
	protected readModel: Model<T> = null;
	protected modelInfo: ModelInfo = null;
	constructor(readonly repository: AbstractRepository<T>) {
		this.writeModel = repository.primaryModel;
		this.readModel = repository.secondaryModel;
		this.modelInfo = repository.modelInfo;
	}

	protected async _create(
		payload: Partial<T> | Partial<T>[],
		extraData?: any,
	): Promise<T> {
		return await this.repository.create({
			...payload,
			...extraData,
		});
	}

	protected async _findById(
		id: ObjectId | string,
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>,
	) {
		return this.repository.findById(id, projection, options);
	}

	protected async _findOne(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>,
	): Promise<T> {
		return this.repository.findOne(filterQuery, projection, options);
	}

	protected async _update(
		fitlerQuery: FilterQuery<T>,
		payload: Partial<T> | UpdateQuery<T>,
		options?: QueryOptions<T> & ExtraUpdateOptions,
	): Promise<UpdateResponse | T | any> {
		return this.writeModel.updateOne(fitlerQuery, payload, options);
	}

	protected async _findByIdAndUpdate(
		id: string | ObjectId,
		payload: Partial<T> | UpdateQuery<T>,
		options?: QueryOptions<T> & ExtraUpdateOptions,
	): Promise<T> {
		return this.repository.findByIdAndUpdate(id, payload, {
			new: true,
			...options,
		});
	}

	protected async _findOneAndUpdate(
		filterQuery: FilterQuery<T>,
		payload: Partial<T> | UpdateQuery<T>,
		options?: QueryOptions<T> & ExtraUpdateOptions,
	): Promise<T> {
		return this.repository.findOneAndUpdate(filterQuery, payload, {
			new: true,
			...options,
		});
	}

	protected async _getListIndexes() {
		return this._getListIndexes();
	}
}
