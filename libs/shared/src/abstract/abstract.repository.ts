import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import * as lodash from 'lodash';
import {
  Aggregate,
  ClientSession,
  FilterQuery,
  Model,
  ObjectId,
  PipelineStage,
  ProjectionType,
  SaveOptions,
  UpdateQuery,
} from 'mongoose';
import { PipelineOptions } from 'stream';
import { LibActionLogService } from '../action-log';
import { ENUM_EVENT_PATTERN, ENUM_QUEUES } from '../constants';
import { ENUM_ACTION_TYPE } from '../constants/enum';
import { toMongoObjectId } from '../mongodb';
import { LibMongoService } from '../mongodb/mongodb.service';
import { RMQClientService } from '../rabbitmq';
import { ActionLog } from '../schemas';
import { AbstractSchema } from '../schemas/abstract.schema';
import { convertToNumber, typeOf } from '../utils/function.utils';
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
		this.rmqClientService = new RMQClientService();
		this.actionLogService = new LibActionLogService();
	}

	async startSession(): Promise<ClientSession> {
		return await this.primaryModel.startSession();
	}

	async create(
		payload: Partial<T> | Partial<T>[],
		options?: SaveOptions & AbstractType.EnableSaveAction,
	): Promise<T | T[]> {
		const payloadData = this.utilService.convertDataToArray(payload);

		const newData: T[] = (await this.primaryModel.create<Partial<T>>(
			payloadData as T[],
			options as any,
		)) as T[];

		//TODO: Save action info
		if (options?.enableSaveAction !== false) {
			this.handleLoggingAction<T | T[]>({
				new_data: newData,
				action_type: ENUM_ACTION_TYPE.CREATE,
				input_payload: payloadData,
			});
		}

		return typeOf(payload) === 'array' ? newData : newData.at(0);
	}

	async update(
		filterQuery: FilterQuery<T>,
		payload: UpdateQuery<T> | Partial<T>,
		options?: AbstractType.UpdateOption<T> & AbstractType.UpdateOnlyOne,
	): Promise<AbstractType.UpdateResponse | T | any> {
		let updateResponse: T | AbstractType.UpdateResponse | any;
		let oldData: T | T[] | any;
		if (options?.updateOnlyOne) {
			if (options?.enableSaveAction !== false) {
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
			if (options?.enableSaveAction !== false) {
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

		if (options?.enableSaveAction !== false) {
			this.handleLoggingAction({
				old_data: oldData,
				action_type: ENUM_ACTION_TYPE.UPDATE,
				input_payload: payload,
			});
		}

		return updateResponse;
	}

	async findOneAndUpdate(
		filterQuery?: FilterQuery<T>,
		updateData?: UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T>,
	): Promise<T> {
		const isReturnNewData = options?.new !== false;
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

		if (options?.enableSaveAction !== false) {
			this.handleLoggingAction<T>({
				old_data: oldData || updatedData,
				action_type: ENUM_ACTION_TYPE.UPDATE,
				input_payload: updateData,
			});
		}

		return updatedData;
	}

	async findByIdAndUpdate(
		id: string | ObjectId,
		updateData?: Partial<T> | UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T>,
	): Promise<T> {
		const isReturnNewData = options?.new !== false;
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

		if (options?.enableSaveAction !== false) {
			this.handleLoggingAction<T>({
				old_data: oldData || updatedData,
				action_type: ENUM_ACTION_TYPE.UPDATE,
				input_payload: updateData,
			});
		}

		return updatedData;
	}

	async deleteMany(
		filterQuery?: FilterQuery<T>,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse> {
		if (options?.enableSaveAction !== false) {
			const oldData = await this.secondaryModel.find(filterQuery);
			if (oldData.length) {
				this.handleLoggingAction<T[]>({
					old_data: oldData,
					action_type: ENUM_ACTION_TYPE.DELETE,
					created_by_user: options?.deleted_by_user as any,
				});
			}
		}

		if (
			options?.softDelete !== false &&
			this.collectionHasField('deleted_at')
		) {
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
			if (oldData) {
				this.handleLoggingAction<T>({
					old_data: oldData,
					action_type: ENUM_ACTION_TYPE.DELETE,
					created_by_user: options?.deleted_by_user as any,
				});
			}
		}

		if (
			options?.softDelete !== false &&
			this.collectionHasField('deleted_at')
		) {
			return this.primaryModel.updateOne(filterQuery, {
				$set: { deleted_at: new Date() },
			});
		}

		return this.primaryModel.deleteOne(filterQuery, options);
	}

	async deleteById(
		id: ObjectId | string,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse> {
		return this.deleteOne({ _id: toMongoObjectId(id) }, options);
	}

	async findOneAndDelete(
		filterQuery: FilterQuery<T>,
		options: AbstractType.DeleteOption<T>,
	): Promise<T> {
		if (options?.enableSaveAction !== false) {
			const oldData = await this.secondaryModel.findOne(filterQuery);
			this.handleLoggingAction<T>({
				old_data: oldData,
				action_type: ENUM_ACTION_TYPE.DELETE,
				created_by_user: options?.deleted_by_user as any,
			});
		}

		if (
			options?.softDelete !== false &&
			this.collectionHasField('deleted_at')
		) {
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
		projection?: ProjectionType<T>,
		options?: AbstractType.FindOptions<T>,
	): Promise<T> {
		const result = await this.secondaryModel.findOne(
			filterQuery || {},
			this.getProjection(projection),
			{
				populate: this.getPopulates(this.getProjection(projection)),
				...options,
			},
		);

		return result?.deleted_at && !options?.includeSoftDelete ? null : result;
	}

	async findById(
		id: string | ObjectId,
		projection?: ProjectionType<T>,
		options?: AbstractType.FindOptions<T>,
	): Promise<T> {
		const result = await this.secondaryModel.findById(
			id,
			this.getProjection(projection),
			{
				populate: this.getPopulates(this.getProjection(projection)),
				...options,
			},
		);

		return result?.deleted_at && !options?.includeSoftDelete ? null : result;
	}

	async findAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<T[]> {
		this.handleIncludeSoftDelete(filterQuery, options);
		return await this.secondaryModel
			.find(filterQuery, this.getProjection(projection), {
				populate: this.getPopulates(this.getProjection(projection)),
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
		if (!filterQuery) filterQuery = {};
		if (Object.keys(filterQuery).includes('deleted_at')) return;
		if (!options?.includeSoftDelete) filterQuery.deleted_at = null;
		else delete filterQuery.deleted_at;
	}

	async findAndCountAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<AbstractType.FindAndCountAllResponse<T>> {
		const [items, count] = await Promise.all([
			this.findAll(filterQuery, projection, options),
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
		input_payload,
		created_by_user,
	}: ActionLog<T, any>) {
		this.logger.log('*********** handleLoggingAction *************');

		const createdByUser =
			created_by_user ??
			this.findCreatedByUserForActionLog(input_payload, action_type);

		switch (action_type) {
			case 'CREATE':
				return this.utilService
					.convertDataToArray<T>(new_data)
					.map((newDataItem) =>
						this.saveIntoLog<T, any>({
							new_data: newDataItem,
							action_type,
							custom_data,
							created_by_user: createdByUser,
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
							created_by_user: createdByUser,
						}),
					);
		}
	}

	saveIntoLog<T, K>(properties: ActionLog<T, K>) {
		try {
			this.logger.log('*********** saveIntoLog *************');
			const {
				new_data,
				old_data,
				action_type,
				custom_data,
				created_by_user,
				data_source,
			} = properties;

			const payload: ActionLog<T, K> = {
				new_data: new_data ? JSON.stringify(new_data) : undefined,
				old_data: old_data ? JSON.stringify(old_data) : undefined,
				action_type,
				custom_data,
				populates: this.getPopulates(),
				data_source: data_source ?? 'SYSTEM',
				exclusive_fields: this.exclusiveFieldChanges,
				collection_name: this.modelInfo.collectionName,
				created_by_user,
			};

			this.rmqClientService.publishDataToQueue<ActionLog<T, K>>(
				ENUM_QUEUES.LOGGING_ACTION,
				ENUM_EVENT_PATTERN.SAVE_ACTION,
				payload,
			);
		} catch (error) {
			console.log(error.stack);
		}
	}

	findCreatedByUserForActionLog<T>(
		inputPayload: T | T[],
		actionType: keyof typeof ENUM_ACTION_TYPE,
	) {
		const inputPayloadList = this.utilService.convertDataToArray(inputPayload);
		if (!inputPayloadList.length) return null;
		const payload: any = inputPayloadList.at(0);
		switch (actionType) {
			case 'CREATE':
			case 'LOGIN':
				return payload.created_by_user;
			case 'UPDATE':
				return payload.updated_by_user;
			case 'DELETE':
				return payload.deleted_by_user;
		}
	}

	getPopulates(projection?: string[]): string[] {
		const result = Object.values(this.modelInfo.schema.paths).reduce(
			(populates: string[], schemaPath: any) => {
				if (this.isValidPopulate(schemaPath)) {
					if (
						(projection?.length && projection.includes(schemaPath.path)) ||
						!projection
					) {
						populates.push(schemaPath.path);
					}
				}
				return populates;
			},
			[],
		) as string[];
		return result;
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

	setAggregate<T extends any>(
		pipeline: PipelineStage[],
		options: PipelineOptions,
	): Aggregate<Array<T>> {
		return this.secondaryModel.aggregate(pipeline, {
			allowDiskUse: true,
			...options,
		});
	}

	collectionHasField(fieldName: string) {
		return lodash.has(this.modelInfo.schema.paths, fieldName);
	}

	getProjection(projection: any) {
		if (!lodash.isEmpty(projection)) {
			switch (typeOf(projection)) {
				case 'string':
					return projection
						.split(',')
						.filter(Boolean)
						.map((item) => item.trim());
				case 'object':
					return Object.entries(projection).reduce((acc: any[], [key, val]) => {
						if (convertToNumber(val) >= 1) acc.push(key);
						return acc;
					}, []);
				default:
					return projection;
			}
		}
		return lodash.keys(this.modelInfo.schema.paths);
	}
}
