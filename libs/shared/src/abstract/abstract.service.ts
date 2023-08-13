import {
	AbstractDocument,
	AbstractSchema,
	ExtraUpdateOptions,
	ModelInfo,
	UpdateResponse,
} from '@app/shared';
import { AbstractType } from '@app/shared/abstract/types/abstract.type';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/microservices';
import {
	ClientSession,
	FilterQuery,
	Model,
	ObjectId,
	ProjectionType,
	QueryOptions,
	SaveOptions,
	UpdateQuery,
} from 'mongoose';
import { AbstractRepository } from './abstract.repository';
@Injectable({ scope: Scope.REQUEST, durable: true })
export abstract class AbstractService<
	T extends AbstractDocument<AbstractSchema>,
> {
	protected abstract logger?: Logger;
	protected primaryModel: Model<T> = null;
	public readModel: Model<T> = null;
	public modelInfo: ModelInfo = null;
	@Inject(CONTEXT) protected context: AbstractType.ExpressContext;

	constructor(readonly repository?: AbstractRepository<T>) {
		if (repository) {
			this.primaryModel = repository.primaryModel;
			this.readModel = repository.secondaryModel;
			this.modelInfo = repository.modelInfo;
		}
	}

	protected async startSession(): Promise<ClientSession> {
		return await this.repository.startSession();
	}

	protected async _create(
		payload: Partial<T> | Partial<T>[],
		options?: SaveOptions,
	): Promise<T> {
		return await this.repository.create(payload, options);
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
		return this.primaryModel.updateOne(fitlerQuery, payload, options);
	}

	protected async _findByIdAndUpdate(
		id: string | ObjectId,
		payload: Partial<T> | UpdateQuery<T>,
		options?: QueryOptions<T>,
	): Promise<T> {
		return this.repository.findByIdAndUpdate(id, payload, options);
	}

	protected async _findOneAndUpdate(
		filterQuery: FilterQuery<T>,
		payload: Partial<T> | UpdateQuery<T>,
		options?: QueryOptions<T>,
	): Promise<T> {
		return this.repository.findOneAndUpdate(filterQuery, payload, options);
	}

	protected async _getListIndexes() {
		return this._getListIndexes();
	}
}
