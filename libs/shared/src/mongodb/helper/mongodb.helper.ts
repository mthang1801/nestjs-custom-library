import mongoose, { PipelineStage } from 'mongoose';
import { MongoDB } from '../types/mongodb.type';
import { Query } from '@nestjs/common';

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

export const toMongoObjectId = (id: any) => {
	if (mongoose.isValidObjectId(id)) return new mongoose.Types.ObjectId(id);
	throw new Error('Invalid ObjectId');
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
	return filterQuery;
};
