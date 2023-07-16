import { PipelineStage } from 'mongoose';

export type AggregationLookup = {
	from: string;
	as?: string;
	localField?: string;
	foreignField?: string;
	let?: Record<string, any>;
	pipeline?: Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[];
	projection?: any;
};
