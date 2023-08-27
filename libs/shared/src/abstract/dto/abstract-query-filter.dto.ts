import { getMetadataAggregate, toMongoObjectId } from '@app/shared/mongodb';
import { MongoDB } from '@app/shared/mongodb/types/mongodb.type';
import {
  checkValidTimestamp,
  endOfDay,
  startOfDay,
} from '@app/shared/utils/dates.utils';
import {
  getPageSkipLimit,
  isEmptyValue,
} from '@app/shared/utils/function.utils';
import { Exclude, Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import * as lodash from 'lodash';
import {
  Expression,
  FilterQuery,
  PipelineStage,
  isValidObjectId,
} from 'mongoose';

export class AbstractFilterQueryDto {
	@IsOptional()
	@Exclude()
	private searchFieldsList: string[] = ['code', 'name'];

	@IsOptional()
	@Exclude()
	private sortFieldsDict: Record<string, 1 | -1 | Expression.Meta> = {
		updated_at: -1,
	};

	@IsOptional()
	private excludedFieldList: string[] = [
		'searchFieldsList',
		'sortFieldsDict',
		'projectFieldList',
		'excludedFieldList',
		'addFieldList',
	];

	@IsOptional()
	@Exclude()
	private projectFieldList: Record<string, 1 | 0 | Expression.Meta> = {};

	@IsOptional()
	@Exclude()
	private addFieldList: Record<string, 1 | 0 | Expression.Meta> = {};

	@IsOptional()
	name?: string;

	@IsOptional()
	code?: string;

	@IsOptional()
	page?: number = 1;

	@IsOptional()
	limit?: number = 20;

	@IsOptional()
	@Transform(({ value }) => startOfDay(value))
	from_date?: Date;

	@IsOptional()
	@Transform(({ value }) => endOfDay(value))
	to_date?: Date;

	@IsOptional()
	status?: string;

	@IsOptional()
	@IsString()
	q?: string;

	@IsOptional()
	created_by_user?: MongoDB.MongoId = null;

	@IsOptional()
	updated_by_user?: MongoDB.MongoId = null;

	@IsOptional()
	deleted_by_user?: MongoDB.MongoId = null;

	@IsOptional()
	@Transform(({ value }) => value?.toLowerCase() === 'true')
	include_soft_delete = false;

	get QueryFilter(): FilterQuery<any> {
		return this.mappingQueryFilterMatch();
	}

	get QuerySearch(): FilterQuery<any> {
		return this.mappingQuerySearchMatch();
	}

	get QuerySearchFilter() {
		return { ...this.QueryFilter, ...this.QuerySearch };
	}

	get AggregateQueryFilter(): PipelineStage.Match {
		return { $match: this.mappingQueryFilterMatch() };
	}

	get AggregateQuerySearch(): PipelineStage.Match {
		return { $match: this.mappingQuerySearchMatch() };
	}

	get FacetResponseResultAndMetadata(): Array<
		PipelineStage.Facet | PipelineStage.Set
	> {
		const { page, limit, skip } = getPageSkipLimit(this);
		return [
			{
				$facet: {
					data: [
						{
							$sort: this.sortFieldsDict,
						},
						{
							$skip: skip,
						},
						{
							$limit: limit,
						},
						lodash.isEmpty(this.addFieldList)
							? null
							: {
									$addFields: this.addFieldList,
							  },
						lodash.isEmpty(this.projectFieldList)
							? null
							: {
									$project: this.projectFieldList,
							  },
					].filter(Boolean),
					metadata: getMetadataAggregate(page, limit),
				},
			},
			{
				$set: {
					metadata: { $first: '$metadata' },
				},
			},
		];
	}

	private mappingQueryFilterMatch() {
		return Object.entries(this).reduce((queryFilter, [fieldName, val]) => {
			fieldName = this.mappingFieldName(fieldName);

			if (!this.isValidField(fieldName, val)) return queryFilter;

			this.generateMongoKeyValueForQueryFilter(queryFilter, fieldName, val);

			return queryFilter;
		}, {});
	}

	private generateMongoKeyValueForQueryFilter(
		queryFilter,
		fieldName,
		val,
	): void {
		const { prefixKey, originalKey } =
			this.analyzePrefixAndOriginalKey(fieldName);

		const formatValue = this.formatMongoValue(fieldName, val);

		switch (prefixKey) {
			case 'from':
				queryFilter[originalKey] = {
					...queryFilter[originalKey],
					$gte: formatValue,
				};
				return;
			case 'to':
				queryFilter[originalKey] = {
					...queryFilter[originalKey],
					$lte: formatValue,
				};
				break;
			case 'in':
				queryFilter[originalKey] = { $in: formatValue };
				break;
			case 'all':
				queryFilter[originalKey] = { $all: formatValue };
				break;
			case 'elemMatch':
				const elemMatchValue = this.setValueForElemMatchOperator(formatValue);
				queryFilter[originalKey] = { $elemMatch: elemMatchValue };
				break;
			default:
				queryFilter[originalKey] = formatValue;
		}
	}

	private analyzePrefixAndOriginalKey(fieldName: string) {
		const prefixKey: string = fieldName.split('_').at(0);

		const originalKey = fieldName
			.split('_')
			.filter(
				(item) => !['from', 'to', 'in', 'all', 'elemMatch'].includes(item),
			)
			.join('_');

		return { prefixKey, originalKey };
	}

	protected formatMongoValue(fieldName: string, value: any) {
		if (fieldName === 'deleted_at')
			return value === true ? { $exists: true } : null;

		if (checkValidTimestamp(value) && value instanceof Date) return value;

		if (!isNaN(Number(value))) return Number(value);

		if (isValidObjectId(value)) return toMongoObjectId(value);

		return value;
	}

	protected setValueForElemMatchOperator(value: string): any {
		return value;
	}

	private mappingQuerySearchMatch() {
		const searchKeyword = this.q;
		if (!searchKeyword) return {};
		return {
			$or: this.searchFieldsList.map((fieldName) => ({
				[fieldName]: new RegExp(searchKeyword, 'gi'),
			})),
		};
	}

	protected mappingFieldName(fieldName: string) {
		const changeRequireList = {
			[fieldName]: fieldName,
			from_date: 'from_updated_at',
			to_date: 'to_updated_at',
			include_soft_delete: 'deleted_at',
		};

		return changeRequireList[fieldName];
	}

	protected set searchFields(values: string[]) {
		this.searchFieldsList = values;
	}

	protected set sortFields(values: Record<string, 1 | -1 | Expression.Meta>) {
		this.sortFieldsDict = values;
	}

	protected set excludedFields(values: string[]) {
		this.excludedFieldList = [
			...new Set(this.excludedFieldList.concat(values)),
		];
	}

	protected set projectFields(values: Record<string, any>) {
		this.projectFieldList = values;
	}

	protected set addFields(values: Record<string, any>) {
		this.addFieldList = values;
	}

	protected isPagingField(fieldName: string) {
		return ['page', 'limit'].includes(fieldName);
	}

	protected isExcludedFields(fieldName: string) {
		return this.excludedFieldList.includes(fieldName);
	}

	protected isSearchField(fieldName: string) {
		return ['q', ...this.searchFieldsList].includes(fieldName);
	}

	isValidField(fieldName, value) {
		return (
			!this.isPagingField(fieldName) &&
			!this.isSearchField(fieldName) &&
			!this.isExcludedFields(fieldName) &&
			!isEmptyValue(value, fieldName, ['deleted_at'])
		);
	}
}
