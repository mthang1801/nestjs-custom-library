import { PipelineStage } from 'mongoose';
import { MongoDB } from '../types/mongodb.type';

const $getMetadataAggregate = (
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

const LookupOneToOne = ({
	from,
	localField,
	project,
	extraPipelineStage = [],
	foreignField = '_id',
	as = undefined,
	condition = undefined,
}: MongoDB.LookupOneToOne): Array<PipelineStage.Lookup | PipelineStage.Set> => {
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

const LookupOneToMany = ({
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
const getMetadataAggregate = (page, limit): any[] => {
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

export default {
	LookupOneToOne,
	LookupOneToMany,
	getMetadataAggregate,
};
