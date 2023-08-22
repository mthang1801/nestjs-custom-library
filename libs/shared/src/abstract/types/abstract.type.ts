import { ENUM_ACTION_TYPE } from '@app/shared/constants/enum';
import { NextFunction, Request, Response } from 'express';
import { Model, PipelineStage, QueryOptions } from 'mongoose';

export namespace AbstractType {
	export type AggregationLookup = {
		from: string;
		as?: string;
		localField?: string;
		foreignField?: string;
		let?: Record<string, any>;
		pipeline?: Exclude<
			PipelineStage,
			PipelineStage.Merge | PipelineStage.Out
		>[];
		projection?: any;
	};
	export type ModelInfo = {
		modelName: string;
		collectionName: string;
		schema?: any;
	};
	export type UpdateResponse = {
		acknowledged?: boolean;
		modifiedCount?: number;
		upsertedId?: any;
		upsertedCount?: number;
		matchedCount?: number;
	};
	export type FindAndCountAllResponse<T> = {
		items: T[];
		count: number;
	};
	export type ExpressContext = Request & Response & NextFunction;
	export type InitAbstractRepository<T> = {
		primaryModel: Model<T>;
		secondaryModel: Model<T>;
	};
	export type ActionType = keyof typeof ENUM_ACTION_TYPE;
	export type HanddleLoggingAction<T extends any | any[]> = {
		newData?: T;
		oldData?: T;
		extraData?: any;
		actionType: ActionType;
	};
	export type EnableSaveAction = {
		enableSaveAction?: boolean;
	};
	type DeleteType = {
		softDelete?: boolean;
	};
	export type UpdateOnlyOne = {
		updateOnlyOne?: boolean;
	};
	export type FindIncludeSoftDelete = {
		includeSoftDelete?: boolean;
	};
	export type FindOptions<T> = QueryOptions<T> & FindIncludeSoftDelete;
	export type UpdateOption<T> = QueryOptions<T> & EnableSaveAction;
	export type DeleteOption<T> = QueryOptions<T> & EnableSaveAction & DeleteType;
}
