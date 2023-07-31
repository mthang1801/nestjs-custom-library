import { User } from '@app/shared/schemas';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import mongoose, { SchemaTypes } from 'mongoose';
import SchemaCustom from '../abstract/schema-option';

@SchemaCustom({
	strict: false,
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class AbstractSchema {
	@Prop({ type: SchemaTypes.ObjectId })
	_id: mongoose.Types.ObjectId;

	@Expose()
	@Transform(
		({ value }) => {
			return value.obj?._id?.toString() || value?.toString();
		},
		{ toClassOnly: true },
	)
	id: string;

	@Prop({ default: null })
	deleted_at: Date;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	created_by?: User;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	updated_by?: User;
}

export type AbstractDocument<T> = Document & T;

export const _AbstractSchema = SchemaFactory.createForClass(AbstractSchema);
