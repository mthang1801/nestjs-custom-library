import { ENUM_STATUS } from '@app/shared/constants/enum';
import { getMetadataAggregate, toMongoObjectId } from '@app/shared/mongodb';
import {
  checkValidTimestamp,
  endOfDay,
  startOfDay,
} from '@app/shared/utils/dates.utils';
import {
  getPageSkipLimit,
  isEmptyValue,
} from '@app/shared/utils/function.utils';
import { ApiPropertyOptional } from '@nestjs/swagger';
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
	public searchFieldsList: string[] = ['code', 'name'];

	@IsOptional()
	@Exclude()
	public sortFieldsDict: Record<string, 1 | -1 | Expression.Meta> = {
		updated_at: -1,
	};

	@IsOptional()
	private excludedFieldList: string[] = [
		'searchFieldsList',
		'sortFieldsDict',
		'projectFieldList',
		'excludedFieldList',
		'addFieldList',
		'allow_show_for_all',
	];

	@IsOptional()
	@Exclude()
	public projectFieldList: Record<string, 1 | 0 | Expression.Meta> = {};

	@IsOptional()
	@Exclude()
	public addFieldList: Record<string, 1 | 0 | Expression.Meta> = {};

	@IsOptional()
	readonly name?: string;

	@IsOptional()
	readonly code?: string;

	@IsOptional()
	@ApiPropertyOptional({ type: Number, example: 1 })
	readonly page?: number = 1;

	@IsOptional()
	@ApiPropertyOptional({ type: Number, example: 20 })
	readonly limit?: number = 20;

	@IsOptional()
	@Transform(({ value }) => value && startOfDay(value))
	@ApiPropertyOptional({ example: '2023-09-01' })
	from_date?: Date;

	@IsOptional()
	@Transform(({ value }) => value && endOfDay(value))
	@ApiPropertyOptional({ example: '2023-09-01' })
	to_date?: Date;

	@IsOptional()
	@ApiPropertyOptional({ enum: ENUM_STATUS, example: ENUM_STATUS.ACTIVE })
	status?: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ example: 'John Doe' })
	q?: string;

	@IsOptional()
	@ApiPropertyOptional({ type: String, example: '64f752075dd853fa9549edbf' })
	@Transform(({ value }) => value && toMongoObjectId(value))
	created_by_user?: string = null;

	@IsOptional()
	@ApiPropertyOptional({ type: String, example: '64f752075dd853fa9549edbf' })
	@Transform(({ value }) => value && toMongoObjectId(value))
	updated_by_user?: string = null;

	@IsOptional()
	@ApiPropertyOptional({ type: String, example: '64f752075dd853fa9549edbf' })
	@Transform(({ value }) => value && toMongoObjectId(value))
	deleted_by_user?: string = null;

	@IsOptional()
	@Transform(({ value }) => value?.toLowerCase() === 'true')
	@ApiPropertyOptional({ type: Boolean, example: false })
	include_soft_delete = false;

	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		example: true,
		description: 'Cho phép người dùng khác được thấy',
	})
	@Transform(({ value }) => value?.toLowerCase() === 'true')
	allow_show_for_all: boolean = true;

	get FilterQuery(): FilterQuery<any> {
		return this.mappingFilterQueryMatch();
	}

	get SearchQuery(): FilterQuery<any> {
		return this.mappingSearchQueryMatch();
	}

	get SearchFilterQuery() {
		return { ...this.FilterQuery, ...this.SearchQuery };
	}

	get AggregateFilterQuery(): PipelineStage.Match {
		return { $match: this.mappingFilterQueryMatch() };
	}

	AggregateFilterQueryAlias(alias: string = ''): PipelineStage.Match {
		return { $match: this.mappingFilterQueryMatch(alias) };
	}

	get AggregateSearchQuery(): PipelineStage.Match {
		return { $match: this.mappingSearchQueryMatch() };
	}

	AggregateSearchQueryAlias(alias: string = ''): PipelineStage.Match {
		return { $match: this.mappingSearchQueryMatch(alias) };
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

	private mappingFilterQueryMatch(alias: string = '') {
		return Object.entries(this).reduce((queryFilter, [fieldName, val]) => {
			fieldName = this.mappingFieldName(fieldName);

			if (!this.isValidField(fieldName, val)) return queryFilter;

			this.generateMongoKeyValueForFilterQuery(
				queryFilter,
				fieldName,
				val,
				alias,
			);

			return queryFilter;
		}, {});
	}

	private generateMongoKeyValueForFilterQuery(
		queryFilter,
		fieldName,
		val,
		alias: string = '',
	): void {
		const { prefixKey, originalKey } =
			this.analyzePrefixAndOriginalKey(fieldName);
		const filterKey = [alias, originalKey].filter(Boolean).join('.');
		const formatValue = this.formatMongoValue(fieldName, val);

		switch (prefixKey) {
			case 'from':
				queryFilter[filterKey] = {
					...queryFilter[originalKey],
					$gte: formatValue,
				};
				return;
			case 'to':
				queryFilter[filterKey] = {
					...queryFilter[originalKey],
					$lte: formatValue,
				};
				break;
			case 'in':
				queryFilter[filterKey] = { $in: formatValue };
				break;
			case 'all':
				queryFilter[filterKey] = { $all: formatValue };
				break;
			case 'elemMatch':
				const elemMatchValue = this.setValueForElemMatchOperator(formatValue);
				queryFilter[filterKey] = { $elemMatch: elemMatchValue };
				break;
			default:
				queryFilter[filterKey] = formatValue;
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

	private mappingSearchQueryMatch(alias: string = '') {
		const searchKeyword = this.q;
		if (!searchKeyword) return {};
		const searchKey = (fieldName) =>
			[alias, fieldName].filter(Boolean).join('.');
		return {
			$or: this.searchFieldsList.map((fieldName) => ({
				[searchKey(fieldName)]: new RegExp(searchKeyword, 'i'),
			})),
		};
	}

	protected mappingFieldName(fieldName: string) {
		const changeRequireList: any = {
			[fieldName]: fieldName,
			from_date: 'from_updated_at',
			to_date: 'to_updated_at',
			include_soft_delete: 'deleted_at',
		};

		if (this.allow_show_for_all) {
			delete changeRequireList.created_by_user;
			delete changeRequireList.upadated_by_user;
			delete changeRequireList.deleted_by_user;
		}

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
			fieldName &&
			!this.isPagingField(fieldName) &&
			!this.isSearchField(fieldName) &&
			!this.isExcludedFields(fieldName) &&
			!isEmptyValue(value, fieldName, ['deleted_at'])
		);
	}
}
