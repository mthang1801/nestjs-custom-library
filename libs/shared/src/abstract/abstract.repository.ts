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
import { EventEmitter2 } from '@nestjs/event-emitter';
import moment from 'moment';
import mongoose, {
	Aggregate,
	ClientSession,
	Connection,
	FilterQuery,
	HydratedDocument,
	Model,
	ObjectId,
	PipelineStage,
	ProjectionType,
	QueryOptions,
	UpdateQuery,
} from 'mongoose';
import { ENUM_DATE_TIME } from '../constants/enum';
import { UtilService } from '../utils/util.service';
import { IAbstractRepository } from './interfaces';
import { AggregationLookup } from './types/abstract.type';

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
	protected eventEmitter: EventEmitter2 = null;
	protected utilService: UtilService = null;
	constructor(
		primaryModel: Model<T>,
		secondaryModel: Model<T>,
		connection?: Connection,
	) {
		this.primaryModel = primaryModel;
		this.secondaryModel = secondaryModel;
		this.connection = connection || mongoose.connection;
		this.modelInfo = {
			modelName: primaryModel.modelName,
			collectionName: primaryModel.collection.name,
			schema: primaryModel.schema,
		};
		this.eventEmitter = new EventEmitter2();
		this.utilService = new UtilService();
	}

	async startTransaction(): Promise<ClientSession> {
		const session = await this.connection.startSession();
		session.startTransaction();
		return session;
	}

	async create(payload: Partial<T> | Partial<T>[]): Promise<T> {
		const newData = await (
			await this.primaryModel.create(payload)
		).populate(this.getPopulates());
		// TODO: Create Create Action Log
		this.createCreatedActionLog(newData);
		return newData;
	}

	createCreatedActionLog(data: Partial<T>) {
		this.checkExistsOrCreateModelLog();
	}

	checkExistsOrCreateModelLog() {
		const modelName = this.modelInfo.modelName.toLowerCase();
		const singularModelName = modelName.endsWith('s')
			? modelName.slice(0, -1)
			: modelName;

		const modelLogName = [singularModelName + 'logs'].join('_');
		console.log(modelLogName);
		console.log(mongoose.connection.collection(this.modelInfo.modelName));
		console.log(mongoose.connection.collection(modelLogName));
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
			populate: this.getPopulates(),
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
			populate: this.getPopulates(),
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
			{ populate: this.getPopulates(), ...options },
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
				populate: this.getPopulates(),
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
			populate: this.getPopulates(),
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
				.find({ ...filterQuery, deleted_at: null }, projection, {
					populate: this.getPopulates(),
					...options,
				})
				.allowDiskUse(true),
			this.secondaryModel.count({ ...filterQuery, deleted_at: null }),
		]);
		return {
			items,
			count,
		};
	}

	getPopulates(): string[] {
		return Object.values(this.modelInfo.schema.paths).reduce(
			(populates: string[], schemaPath: any) => {
				if (['ObjectID', 'Array'].includes(schemaPath.instance)) {
					console.log(schemaPath);
				}
				if (this.isValidPopulate(schemaPath)) populates.push(schemaPath.path);
				return populates;
			},
			[],
		) as string[];
	}

	isValidPopulate(schemaPath: any) {
		return (
			(schemaPath.instance === 'ObjectID' && schemaPath.path !== '_id') ||
			(schemaPath.instance === 'Array' &&
				schemaPath?.$embeddedSchemaType?.instance === 'ObjectID')
		);
	}

	async getListIndex() {
		return this.secondaryModel.listIndexes();
	}

	aggregateBuilder(): Aggregate<any> {
		return (
			this.aggregate ??
			(this.aggregate = this.secondaryModel.aggregate().allowDiskUse(true))
		);
	}

	/**
	 * Find from_date, to_date in from_date, to_date
	 * @param from_date
	 * @param to_date
	 */
	filterFromDateToDateByField(field: string, from_date?: Date, to_date?: Date) {
		const fieldFilter = {};

		if (from_date)
			fieldFilter[field].$lte = new Date(
				moment(from_date).format(ENUM_DATE_TIME.YYYY_MM_DD) +
					ENUM_DATE_TIME.START_OFFSET,
			);

		if (to_date)
			fieldFilter[field].$lte = new Date(
				moment(from_date).format(ENUM_DATE_TIME.YYYY_MM_DD_TIMEZONE) +
					ENUM_DATE_TIME.END_OFFSET,
			);

		return fieldFilter;
	}

	aggregateLookup({
		from,
		localField,
		foreignField,
		as,
		projection,
	}: AggregationLookup): PipelineStage.Lookup {
		return {
			$lookup: {
				from,
				let: { refId: localField },
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ['$$refId', `$${foreignField}`],
							},
						},
					},
					{
						$project: projection,
					},
				],
				as,
			},
		};
	}

	aggregationOneToOneJoin(lookupProperty: AggregationLookup): PipelineStage[] {
		const alias = lookupProperty.as || lookupProperty.from;
		lookupProperty.as = alias;

		return [
			this.aggregateLookup(lookupProperty),
			{
				$set: {
					[alias]: {
						$cond: [
							{ $eq: [{ $isArray: `$${alias}` }, true] },
							{ $first: `$${alias}` },
							`$${alias}`,
						],
					},
				},
			},
		];
	}

	aggregationOneToManyJoin(lookupProperty: AggregationLookup): PipelineStage {
		const alias = lookupProperty.as || lookupProperty.from;
		lookupProperty.as = alias;

		return this.aggregateLookup(lookupProperty);
	}
}
