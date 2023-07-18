import { AbstractSchema } from '@app/shared/schemas';
import {
	ExtraUpdateOptions,
	FindAllResponse,
	ModelInfo,
	RemoveOptions,
	UpdateResponse,
} from '@app/shared/types';
import utils from '@app/shared/utils';
import {
	HttpException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import AbstractLogModel from 'apps/rmq-service/libs/shared/src/abstract/abstract-log.schema';
import { IAbstractLog } from 'apps/rmq-service/libs/shared/src/abstract/interfaces/abstract-log.interface';
import moment from 'moment';
import mongoose, {
	Aggregate,
	ClientSession,
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
import { MongooseDynamicService } from '../mongoose/mongoose.service';
import { UtilService } from '../utils/util.service';
import { AbstractLogDocument } from './abstract-log';
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
	public primaryLogModel: Model<AbstractLogDocument<any>> = null;
	public secondaryLogModel: Model<AbstractLogDocument<any>> = null;
	public modelInfo: ModelInfo = null;
	public collectionName: string = null;
	private aggregate: Aggregate<any> = null;
	protected eventEmitter: EventEmitter2 = null;
	protected utilService: UtilService = null;
	protected configService: ConfigService = null;
	protected mongooseService: MongooseDynamicService = null;
	private excludeFieldChanges = ['_id', 'created_at', 'updated_at'];

	constructor(
		primaryModel: Model<T>,
		secondaryModel: Model<T>,
		primaryLogModel?: Model<AbstractLogDocument<any>>,
		secondaryLogModel?: Model<AbstractLogDocument<any>>,
	) {
		this.primaryModel = primaryModel;
		this.secondaryModel = secondaryModel;
		this.primaryLogModel = primaryLogModel;
		this.secondaryLogModel = secondaryLogModel;

		this.modelInfo = {
			modelName: primaryModel.modelName,
			collectionName: primaryModel.collection.name,
			schema: primaryModel.schema,
		};
		this.eventEmitter = new EventEmitter2();
		this.utilService = new UtilService();
		this.configService = new ConfigService();
		this.mongooseService = new MongooseDynamicService(this.configService);
	}

	async startTransaction(): Promise<ClientSession> {
		return this.mongooseService.startTransaction();
	}

	async create(payload: Partial<T> | Partial<T>[]): Promise<T> {
		const newData = await (
			await this.primaryModel.create(payload)
		).populate(this.getPopulates());
		// TODO: Create Create Action Log
		await this.createCreatedActionLog(newData);
		return newData;
	}

	async createCreatedActionLog(data: Partial<T>) {
		await this.primaryLogModel.create<IAbstractLog>({
			new_data: data.id,
			new_data_desc: data,
			model_reference: this.modelInfo.modelName,
			created_by: data?.created_by,
		});
	}

	async checkExistsOrCreateModelLog(): Promise<mongoose.Model<IAbstractLog>> {
		return new Promise((resolve, reject) => {
			try {
				this.mongooseService.connect().then(() => {
					const modelName = this.modelInfo.modelName.toLowerCase();
					const singularModelName = modelName
						.replace(/ies$/, 'y')
						.replace(/s$/, '');
					const modelLogName = `${singularModelName}_logs`;
					const Model = AbstractLogModel(modelLogName);
					resolve(Model);
				});
			} catch (error) {
				throw new HttpException(error.message, error.status);
			}
		});
	}

	async update(
		filterQuery: FilterQuery<T>,
		payload: UpdateQuery<T>,
		options?: QueryOptions<T> & ExtraUpdateOptions,
	): Promise<UpdateResponse | T | any> {
		if (options?.updateOnlyOne) {
			const oldData = await this.secondaryModel.findOne(filterQuery);
			if (!oldData) {
				throw new NotFoundException();
			}
			const updateResponse = await this.primaryModel.findOneAndUpdate(
				filterQuery,
				{ ...payload },
				{
					new: true,
					...options,
				},
			);
			await this.createUpdatedOneActionLog(
				oldData.toObject(),
				updateResponse.toObject(),
			);

			return updateResponse;
		}

		const oldManyData = await this.secondaryModel.find(filterQuery);
		const updateResponse = await this.primaryModel.updateMany(
			filterQuery,
			{ ...payload },
			{
				new: true,
				...options,
			},
		);
		// TODO: Create update log
		await this.createUpdatedManyActionLog(oldManyData);
		return updateResponse;
	}

	async createUpdatedManyActionLog(oldManyData: T[]) {
		const newManyData = await this.find({
			_id: { $in: oldManyData.map(({ _id }) => _id) },
		});

		for (let i = 0; i < newManyData.count; i += 20) {
			await Promise.all(
				newManyData.items.slice(i, i + 20).map(async (newData) => {
					const oldData = oldManyData.find(
						({ _id }) => String(_id) === String(newData._id),
					);
					if (oldData) {
						await this.createUpdatedOneActionLog(
							oldData.toObject(),
							newData.toObject(),
						);
					}
				}),
			);
		}
	}

	async createUpdatedOneActionLog(oldData: T, newData: T) {
		const fieldChanges = Object.keys(newData)
			.filter((key) => !this.excludeFieldChanges.includes(key))
			.reduce((result, key) => {
				if (JSON.stringify(newData[key]) !== JSON.stringify(oldData[key])) {
					result[key] = `${String(key)} đã thay đổi: ${JSON.stringify(
						newData[key],
					)} -> ${JSON.stringify(oldData[key])}`;
				}
				return result;
			}, {});
		if (!Object.entries(fieldChanges).length) return;

		await this.primaryLogModel.create<IAbstractLog>({
			new_data: newData.id || oldData.id,
			new_data_desc: newData,
			old_data: oldData.id,
			old_data_desc: oldData,
			difference: fieldChanges,
			model_reference: this.modelInfo.modelName,
			created_by: oldData?.created_by,
			updated_by: newData?.updated_by || newData?.created_by,
		});
	}

	async findOneAndUpdate(
		filterQuery?: FilterQuery<T>,
		updateData?: UpdateQuery<T>,
		options?: QueryOptions<T> & ExtraUpdateOptions,
	): Promise<T> {
		return this.primaryModel.findOneAndUpdate(
			filterQuery,
			{ ...updateData },
			{
				populate: this.getPopulates(),
				new: true,
				...options,
			},
		);
	}

	async findByIdAndUpdate(
		id: string | ObjectId,
		updateData?: Partial<T> | UpdateQuery<T>,
		options?: QueryOptions<T>,
	): Promise<T> {
		return this.primaryModel.findByIdAndUpdate(
			id,
			{ ...updateData },
			{
				populate: this.getPopulates(),
				new: true,
				...options,
			},
		);
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
			{ ...this.aggregateLookup(lookupProperty) },
			{ $limit: 1 },
			{ $unwind: { path: `$${alias}`, preserveNullAndEmptyArrays: true } },
		];
	}

	aggregationOneToManyJoin(lookupProperty: AggregationLookup): PipelineStage {
		const alias = lookupProperty.as || lookupProperty.from;
		lookupProperty.as = alias;

		return this.aggregateLookup(lookupProperty);
	}

	$getMetadataAggregate(
		currentPage: number,
		limit: number,
		$totalItems: string,
	) {
		return {
			limit: Number(limit),
			currentPage: Number(currentPage),
			totalItems: $totalItems,
			totalPages: {
				$cond: [
					{ $eq: [{ $mod: [$totalItems, limit] }, 0] },
					{ $divide: [$totalItems, limit] },
					{ $ceil: { $divide: [$totalItems, limit] } },
				],
			},
		};
	}
}
