import { checkValidTimestamp } from '@app/shared/utils/dates.utils';
import { typeOf } from '@app/shared/utils/function.utils';
import mongoose, { PipelineStage, isValidObjectId } from 'mongoose';
import { MongoDB } from '../types/mongodb.type';

export const $getMetadataAggregate = (
	currentPage: number,
	limit: number,
	$totalItems: any,
) =>
	({
		perPage: Number(limit),
		currentPage: Number(currentPage),
		totalItems: $totalItems,
		totalPages: {
			$cond: [
				{ $eq: [{ $mod: [$totalItems, limit] }, 0] },
				{ $divide: [$totalItems, limit] },
				{ $ceil: { $divide: [$totalItems, limit] } },
			],
		} as any,
	} satisfies MongoDB.Metadata);

export const LookupOneToOne = ({
	from,
	localField,
	project,
	extraPipelineStage = [],
	foreignField = '_id',
	as = undefined,
	condition = undefined,
}: MongoDB.LookupOneToOne): Array<PipelineStage.Lookup | PipelineStage.Set> => {
	localField = replaceStartWithDollarSign(localField);
	foreignField = replaceStartWithDollarSign(foreignField);
	const alias = as ?? localField;
	return [
		{
			$lookup: {
				from,
				let: { refId: `$${localField}` },
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ['$$refId', `$${foreignField}`],
							},
						},
					},
					...extraPipelineStage,
					project && { $project: project },
				].filter(Boolean),
				as: alias,
			},
		},
		{
			$set: {
				[alias]: {
					$ifNull: [{ $first: `$${alias}` }, null],
				},
			},
		},
	];
};

const replaceStartWithDollarSign = (field: string) =>
	field.startsWith('$') ? field.slice(1) : field;

export const LookupOneToMany = ({
	from,
	localField,
	project,
	extraPipelineStage = [],
	foreignField = '_id',
	$matchOperator = '$in',
	as = undefined,
}: MongoDB.LookupOneToMany): Array<
	PipelineStage.Lookup | PipelineStage.Set
> => {
	localField = replaceStartWithDollarSign(localField);
	foreignField = replaceStartWithDollarSign(foreignField);
	const alias = as ?? localField;

	return [
		{
			$lookup: {
				from,
				let: { refId: `$${localField}` },
				pipeline: [
					{
						$match: {
							$expr: {
								[$matchOperator]: ['$$refId', `$${foreignField}`],
							},
						},
					},
					...extraPipelineStage,
					project && { $project: project },
				].filter(Boolean),
				as: alias,
			},
		},
		{
			$set: {
				[alias]: {
					$ifNull: [{ $first: `$${alias}` }, null],
				},
			},
		},
	];
};

/**
 *
 * @param page
 * @param limit
 * @returns {MongoDB.Metadata}
 */
export const getMetadataAggregate = (page, limit): any[] => {
	return [
		{
			$count: 'count',
		},
		{
			$addFields: $getMetadataAggregate(page, limit, '$count'),
		},
		{
			$unset: ['count'],
		},
	];
};

export const toMongoObjectId = (id: any, throwError = true) => {
	if (mongoose.isValidObjectId(id)) return new mongoose.Types.ObjectId(id);
	if (throwError) throw new Error('Invalid ObjectId');
};

export const formatMongoValue = (fieldName: string, value: any) => {
	if (fieldName === 'deleted_at') {
		console.log(fieldName, value, typeOf(value));
		return value === true ? { $exists: true } : null;
	}

	if (checkValidTimestamp(value) && value instanceof Date) return value;

	if (!isNaN(Number(value))) return Number(value);

	if (isValidObjectId(value)) return toMongoObjectId(value);

	return value;
};

export const AggregateFilterQueryDateTime = (
	filterQuery: any,
	fromDate: Date,
	toDate: Date,
	field: string,
) => {
	filterQuery[field] = undefined;
	if (fromDate) filterQuery[field] = { $gte: fromDate };

	if (toDate) filterQuery[field] = { ...filterQuery[field], $lte: toDate };

	if (!filterQuery[field]) delete filterQuery[field];

	return filterQuery;
};
