import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IAbstractLog } from 'apps/rmq-service/libs/shared/src/abstract/interfaces/abstract-log.interface';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export abstract class AbstractLog implements IAbstractLog {
	@Prop({ type: mongoose.Schema.Types.Mixed, default: null })
	@ApiPropertyOptional()
	old_data_desc?: any;

	@Prop({ type: mongoose.Schema.Types.Mixed, default: null })
	@ApiPropertyOptional()
	new_data_desc?: any;

	@Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
	@ApiPropertyOptional()
	old_data?: mongoose.Schema.Types.ObjectId;

	@Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
	@ApiPropertyOptional()
	new_data?: mongoose.Schema.Types.ObjectId;

	@Prop({ type: mongoose.Schema.Types.Mixed, default: null })
	@ApiPropertyOptional()
	difference?: any;

	@Prop({ type: mongoose.Schema.Types.Mixed, default: null })
	@ApiPropertyOptional()
	extra_data?: any;

	@Prop({ type: String, default: null })
	@ApiPropertyOptional()
	model_reference?: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
	@ApiPropertyOptional()
	created_by?: mongoose.Schema.Types.ObjectId;
}

export type AbstractLogDocument<T extends AbstractLog> = Document<T>;

export const AbstractLogSchema = (Class) => SchemaFactory.createForClass(Class);
