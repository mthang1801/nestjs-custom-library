import { PipelineStage } from 'mongoose';

export namespace MongoDB {
	export type AggregateOperator =
		| '$eq'
		| '$in'
		| '$lt'
		| '$lte'
		| '$gt'
		| '$gte';
	export type Config = {
		host: string;
		port: string | number;
		username?: string;
		password?: string;
		database: string;
	};
	export type LookupOneToOne = {
		from: string;
		localField: string;
		project?: any;
		foreignField?: string;
		extraPipelineStage?: Exclude<
			PipelineStage,
			PipelineStage.Merge | PipelineStage.Out
		>[];
	};
	export type LookupOneToMany = {
		from: string;
		localField: string;
		project?: any;
		foreignField?: string;
		extraPipelineStage?: Exclude<
			PipelineStage,
			PipelineStage.Merge | PipelineStage.Out
		>[];
		$matchOperator: AggregateOperator;
	};
	export type Metadata = {
		perPage: number;
		currentPage: number;
		totalItems: number;
		totalPages: number;
	};
}
