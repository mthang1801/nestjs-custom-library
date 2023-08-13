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
}: MongoDB.LookupOneToOne): Array<
	PipelineStage.Lookup | PipelineStage.Unwind
> => {
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
				as: localField,
			},
		},
		{
			$unwind: {
				path: `$${localField}`,
				preserveNullAndEmptyArrays: true,
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
}: MongoDB.LookupOneToMany): Array<
	PipelineStage.Lookup | PipelineStage.Unwind
> => {
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
				as: localField,
			},
		},
		{
			$unwind: {
				path: `$${localField}`,
				preserveNullAndEmptyArrays: true,
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
