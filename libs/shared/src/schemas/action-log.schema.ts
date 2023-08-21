import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import SchemaCustom from '../abstract/schema-option';
import {
	ENUM_ACTION_LOG_DATA_SOURCE,
	ENUM_ACTION_TYPE,
} from '../constants/enum';
import { LogContext, LogContextSchema } from './action-log-context.schema';

@SchemaCustom({ collection: 'action_logs', strict: false })
export class ActionLog<T extends any, K extends any> {
	@Prop({ type: mongoose.Schema.Types.Mixed })
	@ApiPropertyOptional({ type: 'any' })
	new_data?: T | string;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	@ApiPropertyOptional({ type: 'any' })
	old_data?: T | string;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	@ApiPropertyOptional({ type: 'any' })
	custom_data?: K;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	@ApiPropertyOptional({ type: 'any' })
	different_data?: any;

	@Prop({
		type: String,
		enum: ENUM_ACTION_LOG_DATA_SOURCE,
		default: ENUM_ACTION_LOG_DATA_SOURCE.SYSTEM,
	})
	data_source?: keyof typeof ENUM_ACTION_LOG_DATA_SOURCE;

	@Prop({ type: LogContextSchema, _id: false })
	@Type(() => LogContext)
	@ApiPropertyOptional()
	context?: LogContext;

	@Prop({
		type: String,
		enum: ENUM_ACTION_TYPE,
		default: ENUM_ACTION_TYPE.CREATE,
		index: 1,
	})
	@ApiPropertyOptional({
		type: String,
		enum: ENUM_ACTION_TYPE,
		example: ENUM_ACTION_TYPE.CREATE,
	})
	action_type?: keyof typeof ENUM_ACTION_TYPE;

	@Prop({ type: [String] })
	@ApiPropertyOptional({ type: [String], example: ['user', 'post'] })
	populates?: string[];

	@Prop({ type: [String] })
	@ApiPropertyOptional({
		type: [String],
		example: ['created_at', 'updated_at'],
	})
	exclusive_fields?: string[];

	@Prop({ type: String, index: 1 })
	@ApiPropertyOptional({
		description: 'The collection name',
		type: [String],
		example: ['user'],
	})
	collection_name?: string;
}

export type ActionLogDocument = Document & ActionLog<any, any>;

export const ActionLogSchema = SchemaFactory.createForClass(ActionLog);
