import { User } from '@app/shared/schemas';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';
import SchemaCustom from '../abstract/schema-option';

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

	@Prop({ default: null })
	deleted_at: Date;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: 1 })
	created_by_user?: User;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: 1 })
	updated_by_user?: User;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: 1 })
	deleted_by_user?: User;
}

export type AbstractDocument<T extends AbstractSchema> = Document & T;

export const _AbstractSchema = SchemaFactory.createForClass(AbstractSchema);
