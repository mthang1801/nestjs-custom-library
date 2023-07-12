import { AbstractSchema } from '@app/shared/schemas';
import {
	ExtraUpdateOptions,
	FindAllResponse,
	ModelInfo,
	RemoveOptions,
	UpdateResponse,
} from '@app/shared/types';
import utils from '@app/shared/utils';
import { Injectable, Logger } from '@nestjs/common';
import {
	Aggregate,
	ClientSession,
	Connection,
	FilterQuery,
	HydratedDocument,
	Model,
	ObjectId,
	ProjectionType,
	QueryOptions,
	UpdateQuery,
} from 'mongoose';
import { IAbstractRepository } from './interfaces';

@Injectable()
export abstract class AbstractRepository<
	T extends HydratedDocument<Document, AbstractSchema>,
> implements IAbstractRepository<T>
{
	protected abstract readonly logger: Logger;
	public primaryModel: Model<T> = null;
	public secondaryModel: Model<T> = null;
	public modelInfo: ModelInfo = null;
	public collectionName: string = null;
	private aggregate: Aggregate<any> = null;
	protected connection: Connection = null;
	constructor(
		primaryModel: Model<T>,
		secondaryModel: Model<T>,
		connection?: Connection,
	) {
		this.primaryModel = primaryModel;
		this.secondaryModel = secondaryModel;
		this.connection = connection;
		this.modelInfo = {
			modelName: primaryModel.modelName,
			collectionName: primaryModel.collection.name,
			schema: primaryModel.schema,
		};
	}

	async startTransaction(): Promise<ClientSession> {
		const session = await this.connection.startSession();
		session.startTransaction();
		return session;
	}

	async create(payload: Partial<T> | Partial<T>[]): Promise<T> {
		return this.primaryModel.create(payload);
	}

	async update(
		fitlerQuery: FilterQuery<T>,
		payload: UpdateQuery<T> | UpdateQuery<T>,
		options?: QueryOptions<T> & ExtraUpdateOptions,
	): Promise<UpdateResponse> {
		if (options.updateOnlyOne) {
			return this.primaryModel.updateOne(fitlerQuery, payload, {
				new: true,
				...options,
			});
		}

		return this.primaryModel.updateMany(fitlerQuery, payload, {
			new: true,
			...options,
		});
	}

	async findOneAndUpdate(
		filterQuery?: FilterQuery<T>,
		updateData?: UpdateQuery<T> | UpdateQuery<T>,
		options?: QueryOptions<T> & ExtraUpdateOptions,
	): Promise<T> {
		return this.primaryModel.findOneAndUpdate(filterQuery, updateData, {
			new: true,
			...options,
		});
	}

	async findByIdAndUpdate(
		id: string | ObjectId,
		updateData?: Partial<T> | UpdateQuery<T>,
		options?: QueryOptions<T>,
	): Promise<T> {
		return this.primaryModel.findByIdAndUpdate(id, updateData, {
			new: true,
			...options,
		});
	}

	async deleteMany(
		filterQuery?: FilterQuery<T>,
		options?: QueryOptions<T>,
	): Promise<UpdateResponse> {
		return this.primaryModel.deleteMany(filterQuery, options);
	}

	async deleteOne(
		filterQuery?: FilterQuery<T>,
		options?: QueryOptions<T>,
	): Promise<UpdateResponse> {
		return this.primaryModel.deleteOne(filterQuery, options);
	}

	async deleteById(
		id: ObjectId,
		options?: QueryOptions<T>,
	): Promise<UpdateResponse> {
		return this.primaryModel.deleteOne({ _id: id }, options);
	}

	async findOneAndDelete(
		filterQuery: FilterQuery<T>,
		options: QueryOptions<T>,
		removePptions?: RemoveOptions,
	): Promise<T> {
		if (removePptions?.permanently) {
			return this.primaryModel.findOneAndDelete(filterQuery, options);
		}
		return this.primaryModel.findOneAndUpdate(
			filterQuery,
			{
				$set: { deleted_at: new Date() },
			},
			options,
		);
	}

	async findOne(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<T> {
		if (utils.typeOf(projection) === 'string')
			return this.secondaryModel
				.findOne(filterQuery, {
					...options,
				})
				.select(projection)
				.exec();

		return this.secondaryModel
			.findOne(filterQuery, projection, {
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
		return result?.deleted_at ? null : result;
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

	aggregateBuilder(): Aggregate<any> {
		return (
			this.aggregate ??
			(this.aggregate = this.secondaryModel.aggregate().allowDiskUse(true))
		);
	}
}
