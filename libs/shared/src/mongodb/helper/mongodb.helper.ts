import * as lodash from 'lodash';
import mongoose, { PipelineStage } from 'mongoose';
import { MongoDB } from '../types/mongodb.type';

export const $missingTypes = [{}, [], null, undefined];
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

export const LookupRecursion = ({
	from,
	localField,
	foreignField,
	as = undefined,
	currentLevel = 0,
	maxDepthLevel = 4,
	pipeline = undefined,
	searchFilterQuery = [],
}: MongoDB.LookupRecursion): PipelineStage.Lookup => {
	console.log('LookupRecursion::', maxDepthLevel);
	localField = replaceStartWithDollarSign(localField);
	foreignField = replaceStartWithDollarSign(foreignField);
	const alias = as ?? from;

	if (currentLevel >= maxDepthLevel) {
		if (maxDepthLevel > 0) {
			pipeline.$lookup.pipeline.push({
				$match:
					matchLookupRecursionSearchFilterQueryCondition(searchFilterQuery),
			});
		}

		return pipeline;
	}

	const pipelineTetmplate = {
		$lookup: {
			from,
			let: { refId: `$${localField}`, currentLevel },
			pipeline: [
				{
					$match: {
						$and: [
							{
								$expr: {
									$eq: ['$$refId', `$${foreignField}`],
								},
							},
						],
					},
				},
			],
			as: alias,
		},
	};

	if (maxDepthLevel === 0) {
		return pipelineTetmplate;
	}

	if (pipeline) {
		pipeline.$lookup.pipeline.push(pipelineTetmplate);

		if (!lodash.isEmpty(searchFilterQuery)) {
			pipeline.$lookup.pipeline.push({
				$match:
					matchLookupRecursionSearchFilterQueryCondition(searchFilterQuery),
			});
		}

		if (currentLevel < maxDepthLevel)
			LookupRecursion({
				from,
				localField,
				foreignField,
				currentLevel: currentLevel + 1,
				maxDepthLevel,
				pipeline: pipeline.$lookup.pipeline[1],
				searchFilterQuery,
				as,
			});
	} else {
		pipeline = pipelineTetmplate;

		if (maxDepthLevel === 1) {
			pipeline.$lookup.pipeline.push({
				$match:
					matchLookupRecursionSearchFilterQueryCondition(searchFilterQuery),
			});
		}

		if (currentLevel < maxDepthLevel)
			LookupRecursion({
				from,
				localField,
				foreignField,
				currentLevel: currentLevel + 1,
				maxDepthLevel,
				pipeline,
				searchFilterQuery,
				as,
			});
	}

	return pipeline;
};

export const matchLookupRecursionSearchFilterQueryCondition = (
	searchFilterQuery: Record<string, any>,
) => {
	return {
		$or: [
			{
				children: { $nin: $missingTypes },
			},
			{
				$and: Object.entries(searchFilterQuery).reduce(
					(acc: any, [key, val]: [string, any]) => {
						acc.push({ [key]: val });
						return acc;
					},
					[],
				),
			},
		],
	};
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
