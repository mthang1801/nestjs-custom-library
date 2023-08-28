import {
	AbstractDocument,
	AbstractSchema,
	ActionLog,
	AggregateFilterQueryDateTime,
	getMetadataAggregate,
} from '@app/shared';
import { AbstractType } from '@app/shared/abstract/types/abstract.type';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as lodash from 'lodash';
import { ObjectId } from 'mongodb';
import {
	ClientSession,
	FilterQuery,
	Model,
	PipelineStage,
	ProjectionType,
	SaveOptions,
	UpdateQuery,
} from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { PipelineOptions } from 'stream';
import { ActionLogQueryFilterDto } from '../action-log/dto/action-log-query-filter.dto';
import { ENUM_MODEL } from '../constants/enum';
import { LibMongoService } from '../mongodb/mongodb.service';
import { getPageSkipLimit } from '../utils/function.utils';
import { UtilService } from '../utils/util.service';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export abstract class AbstractService<
	T extends AbstractDocument<AbstractSchema>,
> {
	protected abstract logger?: Logger;
	protected primaryModel: Model<T> = null;
	public readModel: Model<T> = null;
	public modelInfo: AbstractType.ModelInfo = null;

	@Inject()
	protected i18n: I18nService;

	@Inject()
	protected configService: ConfigService;

	@Inject()
	protected utilService: UtilService;

	@Inject()
	protected readonly mongoService?: LibMongoService;

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
	): Promise<T | T[]> {
		return await this.repository.create(payload, options);
	}

	protected async _findById(
		id: ObjectId | string,
		projection?: ProjectionType<T>,
		options?: AbstractType.FindOptions<T>,
	) {
		return await this.repository.findById(String(id), projection, options);
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
		return await this.repository.findByIdAndUpdate(
			String(id),
			payload,
			options,
		);
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
		id: ObjectId | string,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse> {
		return await this.repository.deleteById(String(id), options);
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

	protected async _aggregate<T extends any>(
		pipeline: PipelineStage[],
		options?: PipelineOptions,
	): Promise<Array<T>> {
		return this.repository.setAggregate<T>(pipeline, options);
	}

	protected async _aggregateBuilder() {
		return this.repository.aggregateBuilder();
	}

	public _saveIntoLog(properties: ActionLog<any, any>) {
		return this.repository.saveIntoLog({
			collection_name: this.modelInfo.collectionName,
			...properties,
			data_source: 'CUSTOM',
		});
	}

	public async _findActionLogs(query: ActionLogQueryFilterDto) {
		const [{ data, metadata }] = await this.mongoService.aggregate(
			ENUM_MODEL.ACTION_LOG,
			[
				this.stageFilterQuery(query),
				this.stageSearchQuery(query),
				this.stageFacetDataAndMeta(query),
			]
				.filter(Boolean)
				.flat(1),
		);

		return { items: data, metadata };
	}

	stageFilterQuery(query: ActionLogQueryFilterDto) {
		const filterQuery: Partial<ActionLogQueryFilterDto> = {};

		filterQuery.collection_name =
			query.collection_name ?? this.modelInfo.collectionName;

		if (query.created_by_user)
			filterQuery.created_by_user = new ObjectId(String(query.created_by_user));

		if (query.action_type) filterQuery.action_type = query.action_type;

		if (query.status) filterQuery.status = query.status;

		AggregateFilterQueryDateTime(
			filterQuery,
			query.from_date,
			query.to_date,
			'created_at',
		);

		if (query.data_source) filterQuery.data_source = query.data_source;

		return lodash.isEmpty(filterQuery)
			? null
			: {
					$match: filterQuery,
			  };
	}

	stageSearchQuery(
		query: ActionLogQueryFilterDto,
	): Array<
		| PipelineStage.Search
		| PipelineStage.AddFields
		| PipelineStage.Match
		| PipelineStage.Sort
	> {
		if (!query.q) return null;
		return [
			{
				$match: {
					raw_data: {
						$regex: new RegExp(query.q, 'gi'),
					},
				},
			},
		];
	}

	stageFacetDataAndMeta(
		query: ActionLogQueryFilterDto,
	): Array<PipelineStage.Facet | PipelineStage.Set> {
		const { page, skip, limit } = getPageSkipLimit(query);
		return [
			{
				$facet: {
					data: [
						{
							$sort: {
								updated_at: -1,
							},
						},
						{
							$skip: skip,
						},
						{
							$limit: limit,
						},
					],
					metadata: getMetadataAggregate(page, limit),
				},
			},
			{
				$set: {
					metadata: {
						$first: '$metadata',
					},
				},
			},
		];
	}
}
