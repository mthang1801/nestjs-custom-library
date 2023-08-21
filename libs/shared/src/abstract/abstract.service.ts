import { AbstractDocument, AbstractSchema } from '@app/shared';
import { AbstractType } from '@app/shared/abstract/types/abstract.type';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/microservices';
import {
	ClientSession,
	FilterQuery,
	Model,
	ObjectId,
	ProjectionType,
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
	public modelInfo: AbstractType.ModelInfo = null;
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
		options?: SaveOptions & AbstractType.EnableSaveAction,
	): Promise<T> {
		return await this.repository.create(payload, options);
	}

	protected async _findById(
		id: ObjectId | string,
		projection?: ProjectionType<T>,
		options?: AbstractType.FindOptions<T>,
	) {
		return await this.repository.findById(id, projection, options);
	}

	protected async _findOne(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T>,
		options?: AbstractType.FindOptions<T>,
	): Promise<T> {
		return this.repository.findOne(filterQuery, projection, options);
	}

	protected async _findAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<T[]> {
		return await this.repository.findAll(filterQuery, projection, options);
	}

	protected async _findAndCountAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<AbstractType.FindAndCountAllResponse<T>> {
		return await this.repository.findAndCountAll(
			filterQuery,
			projection,
			options,
		);
	}

	async _count(
		filterQuery?: FilterQuery<T>,
		options?: AbstractType.FindOptions<T>,
	): Promise<number> {
		return await this.repository.count(filterQuery, options);
	}

	protected async _update(
		fitlerQuery: FilterQuery<T>,
		payload: Partial<T> | UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T> & AbstractType.UpdateOnlyOne,
	): Promise<AbstractType.UpdateResponse | T | any> {
		return await this.repository.update(fitlerQuery, payload, options);
	}

	protected async _findByIdAndUpdate(
		id: string | ObjectId,
		payload: Partial<T> | UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T>,
	): Promise<T> {
		return await this.repository.findByIdAndUpdate(id, payload, options);
	}

	protected async _findOneAndUpdate(
		filterQuery: FilterQuery<T>,
		payload: Partial<T> | UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T>,
	): Promise<T> {
		return await this.repository.findOneAndUpdate(
			filterQuery,
			payload,
			options,
		);
	}

	protected async _getListIndexes() {
		return await this._getListIndexes();
	}

	protected async _deleteById(
		id: ObjectId,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse> {
		return await this.repository.deleteById(id, options);
	}

	protected async _deleteOne(
		filterQuery?: FilterQuery<T>,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse> {
		return await this.repository.deleteOne(filterQuery, options);
	}

	protected async _findOneAndDelete(
		filterQuery: FilterQuery<T>,
		options: AbstractType.DeleteOption<T>,
	): Promise<T> {
		return await this.repository.findOneAndDelete(filterQuery, options);
	}

	protected async _deleteMany(
		filterQuery?: FilterQuery<T>,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse> {
		return await this.repository.deleteMany(filterQuery, options);
	}
}
