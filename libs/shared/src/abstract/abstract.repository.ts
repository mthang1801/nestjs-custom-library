import {
	ExtraUpdateOptions,
	FindAndCountAllResponse,
	ModelInfo,
	RemoveOptions,
	UpdateResponse,
} from '@app/shared/types';
import {
	HttpException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import moment from 'moment';
import {
	Aggregate,
	ClientSession,
	FilterQuery,
	Model,
	ObjectId,
	PipelineStage,
	ProjectionType,
	QueryOptions,
	SaveOptions,
	UpdateQuery,
} from 'mongoose';
import { ENUM_PATTERN, ENUM_QUEUES } from '../constants';
import {
	ENUM_ACTION_TYPE,
	ENUM_DATE_TIME,
	ENUM_MODEL,
} from '../constants/enum';
import { LibMongoService } from '../mongodb/mongodb.service';
import { RMQClientService } from '../rabbitmq';
import { AbstractSchema } from '../schemas/abstract.schema';
import { typeOf } from '../utils/function.utils';
import { UtilService } from '../utils/util.service';
import { AbstractLogDocument } from './abstract-log';
import AbstractLogModel from './abstract-log.schema';
import { IAbstractRepository } from './interfaces';
import { AbstractType } from './types/abstract.type';

@Injectable()
export abstract class AbstractRepository<T extends AbstractSchema>
	implements IAbstractRepository<T>
{
	protected abstract readonly logger: Logger;
	public primaryModel: Model<T> = null;
	public secondaryModel: Model<T> = null;
	public primaryLogModel: Model<AbstractLogDocument<any>> = null;
	public secondaryLogModel: Model<AbstractLogDocument<any>> = null;
	public modelInfo: ModelInfo = null;
	public logModelInfo: ModelInfo = null;
	public collectionName: string = null;
	private aggregate: Aggregate<any> = null;
	protected eventEmitter: EventEmitter2 = null;
	protected utilService: UtilService = null;
	protected configService: ConfigService = null;
	protected mongooseService: LibMongoService = null;
	private excludeFieldChanges = ['_id', 'created_at', 'updated_at'];
	protected context: AbstractType.ExpressContext;
	protected rmqClient: ClientProxy;
	protected rmqClientService: RMQClientService;

	constructor({
		primaryModel,
		secondaryModel,
		primaryLogModel,
		secondaryLogModel,
		context,
	}: AbstractType.InitAbstractRepository<T>) {
		this.primaryModel = primaryModel;
		this.secondaryModel = secondaryModel;
		this.primaryLogModel = primaryLogModel;
		this.secondaryLogModel = secondaryLogModel;
		this.context = context;
		this.modelInfo = {
			modelName: primaryModel.modelName,
			collectionName: primaryModel.collection.name,
			schema: primaryModel.schema,
		};
		this.logModelInfo = {
			modelName: primaryLogModel?.modelName,
			collectionName: primaryLogModel?.collection?.name,
			schema: primaryLogModel?.schema,
		};
		this.eventEmitter = new EventEmitter2();
		this.utilService = new UtilService();
		this.configService = new ConfigService();
		this.mongooseService = new LibMongoService(this.configService);
		this.rmqClientService = new RMQClientService(this.configService);
		this.rmqClient = this.rmqClientService.createClient({
			queue: ENUM_QUEUES.SAVE_ACTION,
			urls: [this.rmqClientService.getUrl()],
		});
	}

	async startSession(): Promise<ClientSession> {
		return await this.primaryModel.startSession();
	}

	async create(
		payload: Partial<T> | Partial<T>[],
		options?: SaveOptions,
	): Promise<T> {
		const newData: T = (await this.primaryModel.create<Partial<T>>(
			typeOf(payload) === 'array' ? (payload as T[]) : ([payload] as T[]),
			options as any,
		)) as any;

		await this.saveIntoLog<T>({
			newData,
			actionType: ENUM_ACTION_TYPE.CREATE,
		});

		return newData as T;
	}

	async saveIntoLog<T>({
		newData,
		oldData,
		actionType,
		extraData,
	}: AbstractType.LogActionPayload<T>) {
		const payload: AbstractType.LogActionPayload<T> | any = {
			newData: newData ? JSON.stringify(newData) : undefined,
			oldData: oldData ? JSON.stringify(oldData) : undefined,
			context: this.getContext(),
			actionType,
			extraData,
			populates: this.getPopulates(),
			metaCollectionName: this.modelInfo.collectionName,
			collectionName:
				this.logModelInfo.collectionName ?? this.generateLogCollectionName(),
		};

		const rmqBuilder = this.rmqClientService.crerateBuilder(payload);
		this.rmqClient.emit({ cmd: ENUM_PATTERN.SAVE_ACTION }, rmqBuilder);
	}

	generateLogCollectionName(): `${string}_logs` {
		const modelName = this.modelInfo.modelName.toLowerCase();
		const singularModelName = modelName.replace(/ies$/, 'y').replace(/s$/, '');
		return `${singularModelName}_logs`;
	}

	getContext() {
		return {
			path: this?.context?.route?.path,
			url: this?.context?.url,
			method: this?.context?.method,
			body: this?.context?.body,
			params: this?.context?.['params'],
			query: this?.context?.['query'],
		};
	}

	async createSystemModelLog() {
		return new Promise((resolve, reject) => {
			try {
				this.mongooseService.connect().then(() => {
					const Model = AbstractLogModel(ENUM_MODEL.SYSTEM_LOG);
					resolve(Model);
				});
			} catch (error) {
				throw new HttpException(error.message, error.status);
			}
		});
	}

	async update(
		filterQuery: FilterQuery<T>,
		payload: UpdateQuery<T> | Partial<T>,
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
					lean: true,
					...options,
				},
			);

			return updateResponse;
		}

		const updateResponse = await this.primaryModel.updateMany(
			filterQuery,
			{ ...payload },
			{
				new: true,
				...options,
			},
		);

		return updateResponse;
	}

	async findOneAndUpdate(
		filterQuery?: FilterQuery<T>,
		updateData?: UpdateQuery<T>,
		options?: QueryOptions<T>,
	): Promise<T> {
		const isReturnNewData = options.new !== false;
		const oldData = isReturnNewData && (await this.findOne(filterQuery));
		const updatedData = await this.primaryModel.findOneAndUpdate(
			filterQuery,
			updateData,
			{
				populate: this.getPopulates(),
				new: true,
				...options,
			},
		);
		await this.saveIntoLog<T>({
			newData: isReturnNewData && updatedData,
			oldData: oldData || updatedData,
			actionType: ENUM_ACTION_TYPE.UPDATE,
		});

		return updatedData;
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
		if (this.utilService.typeOf(projection) === 'string')
			return this.secondaryModel
				.findOne(filterQuery, {
					...options,
				})
				.select(projection);

		return this.secondaryModel.findOne(filterQuery, projection, {
			populate: this.getPopulates(),
			...options,
		});
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

	async findAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<T[]> {
		return await this.secondaryModel.find(
			{ ...filterQuery, deleted_at: null },
			projection,
			{
				populate: this.getPopulates(),
				...options,
			},
		);
	}

	async findAndCountAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: QueryOptions<T>,
	): Promise<FindAndCountAllResponse<T>> {
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
	}: AbstractType.AggregationLookup): PipelineStage.Lookup {
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

	aggregationOneToOneJoin(
		lookupProperty: AbstractType.AggregationLookup,
	): PipelineStage[] {
		const alias = lookupProperty.as || lookupProperty.from;
		lookupProperty.as = alias;

		return [
			{ ...this.aggregateLookup(lookupProperty) },
			{ $limit: 1 },
			{ $unwind: { path: `$${alias}`, preserveNullAndEmptyArrays: true } },
		];
	}

	aggregationOneToManyJoin(
		lookupProperty: AbstractType.AggregationLookup,
	): PipelineStage {
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
