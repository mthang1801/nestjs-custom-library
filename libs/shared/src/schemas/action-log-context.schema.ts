import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import mongoose from 'mongoose';
import SchemaCustom from '../abstract/schema-option';
import { ENUM_ACTION_TYPE } from '../constants/enum';

@SchemaCustom({ strict: false })
export class LogContext {
	@Prop()
	@ApiPropertyOptional({ example: '/posts' })
	path: string;

	@Prop()
	@ApiPropertyOptional({ example: '/posts' })
	url: string;

	@Prop()
	@ApiPropertyOptional({
		enum: ENUM_ACTION_TYPE,
		example: ENUM_ACTION_TYPE.CREATE,
	})
	method: string;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	@ApiPropertyOptional({
		type: 'object',
		example: {
			title: 'This is the first post 8',
			short_content:
				'This is the first post This is the first post This is the first post',
			status: 'INACTIVE',
			content:
				'This is the first post This is the first post This is the first post',
			author: '64d8c9d34a6f63ca67ebefc9',
		},
	})
	body: any;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	@ApiPropertyOptional({ example: {} })
	params: any;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	@ApiPropertyOptional({ example: {} })
	query: any;
}

export type LogContextDocument = LogContext & Document;

export const LogContextSchema = SchemaFactory.createForClass(LogContext);
