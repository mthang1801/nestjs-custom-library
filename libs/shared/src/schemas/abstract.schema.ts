import { User } from '@app/shared/schemas';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';
import SchemaCustom from '../abstract/schema-option';
import { ApiPropertyOptional } from '@nestjs/swagger';

@SchemaCustom({
	strict: false,
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class AbstractSchema {
	@Expose()
	@Transform(
		({ value }) => {
			return value.obj?._id?.toString() || value?.toString();
		},
		{ toClassOnly: true },
	)
	id: string;

	@Prop({ type: String, maxlength: 255, index: 1 })
	@ApiPropertyOptional({ example: 'john doe' })
	name: string;

	@Prop({ type: String, maxlength: 255, index: 1 })
	@ApiPropertyOptional({ example: 'ABC123' })
	code: string;

	@Prop({ type: String })
	@ApiPropertyOptional({ example: 'ACTIVE' })
	status: string;

	@Prop({ default: null })
	@ApiPropertyOptional()
	deleted_at: Date;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: 1 })
	@ApiPropertyOptional()
	created_by_user?: User;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: 1 })
	@ApiPropertyOptional()
	updated_by_user?: User;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: 1 })
	@ApiPropertyOptional()
	deleted_by_user?: User;
}

export type AbstractDocument<T extends AbstractSchema> = Document & T;

export const _AbstractSchema = SchemaFactory.createForClass(AbstractSchema);
