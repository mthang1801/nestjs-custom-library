import { ExtraUpdateOptions, ModelInfo } from '@app/common';
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
import { AbstractSchema } from './abstract.schema';

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
		return this.readModel.findById(id, projection, options);
	}

	protected _update(
		fitlerQuery: FilterQuery<T>,
		payload: UpdateQuery<T>,
		options?: QueryOptions<T> & ExtraUpdateOptions,
	) {
		return this.writeModel.updateOne(fitlerQuery, payload, options);
	}
}
