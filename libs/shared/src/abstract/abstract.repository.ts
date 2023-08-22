import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import {
	Aggregate,
	ClientSession,
	FilterQuery,
	Model,
	ObjectId,
	ProjectionType,
	SaveOptions,
	UpdateQuery,
} from 'mongoose';
import { LibActionLogService } from '../action-log';
import { ENUM_EVENT_PATTERN, ENUM_QUEUES } from '../constants';
import { ENUM_ACTION_TYPE } from '../constants/enum';
import { LibMongoService } from '../mongodb/mongodb.service';
import { RMQClientService } from '../rabbitmq';
import { ActionLog } from '../schemas';
import { AbstractSchema } from '../schemas/abstract.schema';
import { typeOf } from '../utils/function.utils';
import { UtilService } from '../utils/util.service';
import { IAbstractRepository } from './interfaces';
import { AbstractType } from './types/abstract.type';

@Injectable()
export abstract class AbstractRepository<T extends AbstractSchema>
	implements IAbstractRepository<T>
{
	protected abstract readonly logger: Logger;
	public primaryModel: Model<T> = null;
	public secondaryModel: Model<T> = null;
	public modelInfo: AbstractType.ModelInfo = null;
	public collectionName: string = null;
	private aggregate: Aggregate<any> = null;
	protected eventEmitter: EventEmitter2 = null;
	protected utilService: UtilService = null;
	protected configService: ConfigService = null;
	protected mongooseService: LibMongoService = null;
	private exclusiveFieldChanges = ['_id', 'created_at', 'updated_at'];
	protected rmqClient: ClientProxy;
	protected rmqClientService: RMQClientService;
	protected actionLogService: LibActionLogService;
	constructor({
		primaryModel,
		secondaryModel,
	}: AbstractType.InitAbstractRepository<T>) {
		this.primaryModel = primaryModel;
		this.secondaryModel = secondaryModel;
		this.modelInfo = {
			modelName: primaryModel.modelName,
			collectionName: primaryModel.collection.name,
			schema: primaryModel.schema,
		};

		this.eventEmitter = new EventEmitter2();
		this.utilService = new UtilService();
		this.configService = new ConfigService();
		this.mongooseService = new LibMongoService(this.configService);
		this.rmqClientService = new RMQClientService(this.configService);
		this.actionLogService = new LibActionLogService(this.configService);
	}

	async startSession(): Promise<ClientSession> {
		return await this.primaryModel.startSession();
	}

	async create(
		payload: Partial<T> | Partial<T>[],
		options?: SaveOptions & AbstractType.EnableSaveAction,
	): Promise<T> {
		const newData: T = (await this.primaryModel.create<Partial<T>>(
			typeOf(payload) === 'array' ? (payload as T[]) : ([payload] as T[]),
			options as any,
		)) as any;

		//TODO: Save action info
		if (options?.enableSaveAction !== false) {
			this.handleLoggingAction<T>({
				new_data: newData,
				action_type: ENUM_ACTION_TYPE.CREATE,
			});
		}

		return newData as T;
	}

	async update(
		filterQuery: FilterQuery<T>,
		payload: UpdateQuery<T> | Partial<T>,
		options?: AbstractType.UpdateOption<T> & AbstractType.UpdateOnlyOne,
	): Promise<AbstractType.UpdateResponse | T | any> {
		let updateResponse: T | AbstractType.UpdateResponse | any;
		let oldData: T | T[] | any;

		if (options?.updateOnlyOne) {
			if (options.enableSaveAction !== false) {
				oldData = await this.secondaryModel.findOne(filterQuery);
			}

			updateResponse = await this.primaryModel.findOneAndUpdate(
				filterQuery,
				{ ...payload },
				{
					new: true,
					lean: true,
					...options,
				},
			);
		} else {
			if (options.enableSaveAction !== false) {
				oldData = await this.secondaryModel.find(filterQuery);
			}

			updateResponse = await this.primaryModel.updateMany(
				filterQuery,
				{ ...payload },
				{
					new: true,
					...options,
				},
			);
		}

		if (options.enableSaveAction !== false) {
			this.handleLoggingAction({
				old_data: oldData,
				action_type: ENUM_ACTION_TYPE.UPDATE,
			});
		}

		return updateResponse;
	}

	async findOneAndUpdate(
		filterQuery?: FilterQuery<T>,
		updateData?: UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T>,
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

		if (options.enableSaveAction !== false) {
			this.handleLoggingAction<T>({
				old_data: oldData || updatedData,
				action_type: ENUM_ACTION_TYPE.UPDATE,
			});
		}

		return updatedData;
	}

	async findByIdAndUpdate(
		id: string | ObjectId,
		updateData?: Partial<T> | UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T>,
	): Promise<T> {
		const isReturnNewData = options.new !== false;
		const oldData = isReturnNewData && (await this.findById(id));

		const updatedData = await this.primaryModel.findByIdAndUpdate(
			id,
			{ ...updateData },
			{
				populate: this.getPopulates(),
				new: true,
				...options,
			},
		);

		if (options.enableSaveAction !== false) {
			this.handleLoggingAction<T>({
				old_data: oldData || updatedData,
				action_type: ENUM_ACTION_TYPE.UPDATE,
			});
		}

		return updatedData;
	}

	async deleteMany(
		filterQuery?: FilterQuery<T>,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse> {
		if (options.enableSaveAction !== false) {
			const oldData = await this.secondaryModel.find(filterQuery);
			this.handleLoggingAction<T[]>({
				old_data: oldData,
				action_type: ENUM_ACTION_TYPE.DELETE,
			});
		}

		if (options.softDelete) {
			return this.primaryModel.updateMany(filterQuery, {
				$set: { deleted_at: new Date() },
			});
		}

		return this.primaryModel.deleteMany(filterQuery, options);
	}

	async deleteOne(
		filterQuery?: FilterQuery<T>,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse> {
		if (options?.enableSaveAction !== false) {
			const oldData = await this.secondaryModel.findOne(filterQuery);
			this.handleLoggingAction<T>({
				old_data: oldData,
				action_type: ENUM_ACTION_TYPE.DELETE,
			});
		}

		if (options?.softDelete) {
			return this.primaryModel.updateOne(filterQuery, {
				$set: { deleted_at: new Date() },
			});
		}

		return this.primaryModel.deleteOne(filterQuery, options);
	}

	async deleteById(
		id: ObjectId,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse> {
		return this.deleteOne({ _id: id }, options);
	}

	async findOneAndDelete(
		filterQuery: FilterQuery<T>,
		options: AbstractType.DeleteOption<T>,
	): Promise<T> {
		if (options.enableSaveAction !== false) {
			const oldData = await this.secondaryModel.findOne(filterQuery);
			this.handleLoggingAction<T>({
				old_data: oldData,
				action_type: ENUM_ACTION_TYPE.DELETE,
			});
		}

		if (options?.softDelete) {
			return this.primaryModel.findOneAndUpdate(
				filterQuery,
				{
					$set: { deleted_at: new Date() },
				},
				{ populate: this.getPopulates(), ...options },
			);
		}

		return this.primaryModel.findOneAndDelete(filterQuery, options);
	}

	async findOne(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<T> {
		this.handleIncludeSoftDelete(filterQuery, options);
		console.log('findOne::', filterQuery);
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
		options?: AbstractType.FindOptions<T>,
	): Promise<T> {
		const result = await this.secondaryModel.findById(id, projection, {
			populate: this.getPopulates(),
			...options,
		});

		return result?.deleted_at && !options?.includeSoftDelete ? null : result;
	}

	async findAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<T[]> {
		this.handleIncludeSoftDelete(filterQuery, options);
		return await this.secondaryModel
			.find(filterQuery, projection, {
				populate: this.getPopulates(),
				...options,
			})
			.allowDiskUse(true);
	}

	async count(
		filterQuery?: FilterQuery<T>,
		options?: AbstractType.FindOptions<T>,
	): Promise<number> {
		this.handleIncludeSoftDelete(filterQuery, options);
		return await this.secondaryModel.count(filterQuery);
	}

	private handleIncludeSoftDelete(
		filterQuery: FilterQuery<T>,
		options: AbstractType.FindOptions<T>,
	) {
		if (!options?.includeSoftDelete) filterQuery.deleted_at = null;
	}

	async findAndCountAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<AbstractType.FindAndCountAllResponse<T>> {
		const [items, count] = await Promise.all([
			this.findAll(filterQuery, projection, {
				populate: this.getPopulates(),
				...options,
			}),
			this.count(filterQuery, options),
		]);
		return {
			items,
			count,
		};
	}

	handleLoggingAction<T>({
		new_data,
		old_data,
		custom_data,
		action_type,
	}: ActionLog<T, any>) {
		this.logger.log('*********** handleLoggingAction *************');

		switch (action_type) {
			case 'CREATE':
				return this.utilService
					.convertDataToArray<T>(new_data)
					.map((newDataItem) =>
						this.saveIntoLog<T, any>({
							new_data: newDataItem,
							action_type,
							custom_data,
						}),
					);

			case 'UPDATE':
			case 'DELETE':
				return this.utilService
					.convertDataToArray<T>(old_data)
					.map((oldDataItem) =>
						this.saveIntoLog<T, any>({
							old_data: oldDataItem,
							action_type,
							custom_data,
						}),
					);
		}
	}

	saveIntoLog<T, K>({
		new_data,
		old_data,
		action_type,
		custom_data,
	}: ActionLog<T, K>) {
		try {
			this.logger.log('*********** saveIntoLog *************');

			const payload: ActionLog<T, K> = {
				new_data: new_data ? JSON.stringify(new_data) : undefined,
				old_data: old_data ? JSON.stringify(old_data) : undefined,
				action_type,
				custom_data,
				populates: this.getPopulates(),
				exclusive_fields: this.exclusiveFieldChanges,
				collection_name: this.modelInfo.collectionName,
			};

			console.log(payload);

			this.rmqClientService.publishDataToQueue<ActionLog<T, K>>(
				ENUM_QUEUES.LOGGING_ACTION,
				ENUM_EVENT_PATTERN.SAVE_ACTION,
				payload,
			);
		} catch (error) {
			console.log(error.stack);
		}
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
}
