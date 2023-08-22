import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as lodash from 'lodash';
import { PipelineStage, isValidObjectId } from 'mongoose';
import {
	ENUM_ACTION_LOG_DATA_SOURCE,
	ENUM_ACTION_TYPE,
} from '../constants/enum';
import {
	filterQueryDateTime,
	getMetadataAggregate,
	toMongoObjectId,
} from '../mongodb';
import { LibMongoService } from '../mongodb/mongodb.service';
import { ActionLog } from '../schemas';
import { getPageSkipLimit, typeOf } from '../utils/function.utils';
import { UtilService } from '../utils/util.service';
import { LibActionLogRepository } from './action-log.repository';
import { ActionLogQueryFilterDto } from './dto/action-log-query-filter.dto';
import { SaveCustomActionLogDto } from './dto/save-custom-action-log.dto';

@Injectable()
export class LibActionLogService {
	logger = new Logger(LibActionLogService.name);
	@Inject()
	utilService: UtilService;

	constructor(
		configService: ConfigService,
		private readonly actionLogRepository?: LibActionLogRepository,
		private readonly mongoService?: LibMongoService,
	) {}

	public async save(payload: ActionLog<any, any>) {
		try {
			this.logger.log(`${'*'.repeat(20)} save() ${'*'.repeat(20)}`);

			this.parseData(payload);
			if (
				[ENUM_ACTION_TYPE.UPDATE].includes(
					payload.action_type as ENUM_ACTION_TYPE,
				)
			) {
				if (!payload.new_data && payload.old_data) {
					payload.new_data = await this.mongoService.findById(
						payload.collection_name,
						payload.old_data?._id || payload.old_data?.id,
					);
				}
			}

			this.handleExclusiveFields(payload);
			this.handlePopulateFieldsInfo(payload);
			this.setDiffFields(payload);
			this.setRawData(payload);

			if (this.canCreateActionLog(payload))
				return this.actionLogRepository.primaryModel.create(payload);
		} catch (error) {
			console.log(error.stack);
		}
	}

	setRawData(payload: ActionLog<any, any>) {
		const data: any = {};
		if (payload.new_data) data.new_data = payload.new_data;
		if (payload.old_data) data.old_data = payload.old_data;
		if (payload.custom_data) data.custom_data = payload.custom_data;
		payload.raw_data = JSON.stringify(data) as string;
	}

	private parseData(payload: ActionLog<any, any>) {
		payload.new_data = this.utilService.parseData(payload.new_data);
		payload.old_data = this.utilService.parseData(payload.old_data);
	}

	private handleExclusiveFields(payload: ActionLog<any, any>) {
		payload?.exclusive_fields?.length &&
			payload.exclusive_fields.forEach((field) => {
				payload.new_data && delete payload.new_data[field];
				payload.old_data && delete payload.old_data[field];
			});
	}

	private handlePopulateFieldsInfo(payload: ActionLog<any, any>) {
		this.logger.log(`******* handlePopulateFieldsInfo() *******`);
		['new_data', 'old_data'].forEach((typeData) => {
			if (payload[typeData])
				payload[typeData] = this.formatPopulateFields(
					payload[typeData],
					payload.populates,
				);
		});
	}

	private formatPopulateFields(data, populates) {
		this.logger.log(
			`${'*'.repeat(20)} formatPopulateFields() ${'*'.repeat(20)}`,
		);

		return Object.entries(data).reduce((res, [key, val]: [string, any]) => {
			if (populates.includes(key) && !lodash.isEmpty(val)) {
				res[key] =
					typeOf(val) === 'array'
						? val.map(({ _id }) => toMongoObjectId(_id))
						: toMongoObjectId(val);
			} else {
				res[key] = val;
			}
			return res;
		}, {});
	}

	private setDiffFields(payload: ActionLog<any, any>): void {
		//TODO: Thực hiện khi có action là DELETE
		if (payload.old_data && payload.action_type === 'DELETE') {
			payload.different_data = Object.entries(payload.old_data).reduce(
				(result, [key, oldValue]) => {
					result[key] = {
						old_data: oldValue,
						new_data: null,
					};
					return result;
				},
				{},
			);
			return;
		}

		//TODO: Thực hiện khi có action là CREATE hoặc UPDATE
		if (!payload.new_data) return;

		payload.different_data = Object.entries(payload.new_data).reduce(
			(result, [key, newValue]) => {
				const oldValue = payload?.old_data ? payload?.old_data[key] : undefined;

				if (this.isOldAndNewValueEqual(oldValue, newValue)) return result;
				console.log(newValue, oldValue, newValue === oldValue);
				result[key] = {
					old_data: oldValue,
					new_data: newValue,
				};
				return result;
			},
			{},
		);
	}

	private isOldAndNewValueEqual(oldValue, newValue) {
		if (isValidObjectId(oldValue) && isValidObjectId(newValue))
			return String(oldValue) === String(newValue);

		if (lodash.isEqual(oldValue, newValue)) return true;

		return false;
	}

	private canCreateActionLog(payload: ActionLog<any, any>): boolean {
		if (
			payload.action_type !== 'DELETE' &&
			lodash.isEmpty(payload.different_data)
		)
			return false;
		return true;
	}

	public async saveCustomLog(properties: SaveCustomActionLogDto) {
		const payload = {
			action_type: properties.action_type,
			custom_data: properties.custom_data,
			data_source: ENUM_ACTION_LOG_DATA_SOURCE.CUSTOM,
			collection_name: properties.collection_name,
		};

		this.setRawData(payload);
		return this.actionLogRepository.primaryModel.create(payload);
	}

	public async findAll(query: ActionLogQueryFilterDto) {
		const [{ data, meta }] =
			await this.actionLogRepository.secondaryModel.aggregate(
				[
					this.stageFilterQuery(query),
					this.stageSearchQuery(query),
					this.stageFacetDataAndMeta(query),
				]
					.filter(Boolean)
					.flat(1),
			);

		return { items: data, metadata: meta };
	}

	stageFilterQuery(query: ActionLogQueryFilterDto) {
		console.log(query);
		let filterQueryResult: any = {};
		delete filterQueryResult.page;
		delete filterQueryResult.limit;
		delete filterQueryResult.q;

		filterQueryResult = {
			...filterQueryResult,
			...filterQueryDateTime(query.from_date, query.to_date, 'updated_at'),
		};

		return lodash.isEmpty(filterQueryResult)
			? null
			: { $match: filterQueryResult };
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

	stageFacetDataAndMeta(query: ActionLogQueryFilterDto): PipelineStage.Facet {
		const { page, skip, limit } = getPageSkipLimit(query);
		return {
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
				meta: getMetadataAggregate(page, limit),
			},
		};
	}
}
