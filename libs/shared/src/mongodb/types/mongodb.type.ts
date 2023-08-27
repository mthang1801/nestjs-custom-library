import { PipelineStage, Types } from 'mongoose';

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
	export type MongoId = Types.ObjectId | string;
	export type LookupOneToOne = {
		from: string;
		let: Record<string, string> | any;
		localField: string;
		project?: any;
		foreignField?: string;
		extraPipelineStage?: Exclude<
			PipelineStage,
			PipelineStage.Merge | PipelineStage.Out
		>[];
		condition?: PipelineStage.Match | any;
		as?: string;
	};
	export type LookupOneToMany = {
		from: string;
		let: Record<string, string> | any;
		localField: string;
		project?: any;
		foreignField?: string;
		extraPipelineStage?: Exclude<
			PipelineStage,
			PipelineStage.Merge | PipelineStage.Out
		>[];
		$matchOperator: AggregateOperator;
		as?: string;
		condition?: PipelineStage.Match | any;
	};
	export type Metadata = {
		perPage: number;
		currentPage: number;
		totalItems: number;
		totalPages: number;
	};
}
