import { ENUM_ACTION_TYPE } from '@app/shared/constants/enum';
import { ExecutionContext } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Model, PipelineStage } from 'mongoose';
import { AbstractLogDocument } from '../abstract-log';

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
	export type ExpressContext = Request & Response & NextFunction;
	export type InitAbstractRepository<T> = {
		primaryModel: Model<T>;
		secondaryModel: Model<T>;
		primaryLogModel?: Model<AbstractLogDocument<any>>;
		secondaryLogModel?: Model<AbstractLogDocument<any>>;
		context?: ExpressContext;
	};
	export type ActionType = keyof typeof ENUM_ACTION_TYPE;

	export type LogActionPayload<T> = {
		newData?: any;
		oldData?: any;
		extraData?: any;
		context?: ExecutionContext | any;
		actionType: ActionType;
		collectionName?: string;
		metaCollectionName?: string;
		populates?: string[];
	};
}
