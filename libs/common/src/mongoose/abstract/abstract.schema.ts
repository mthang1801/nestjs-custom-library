import { User } from '@app/common/schemas';
import { Prop, Schema } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';

@Schema()
export class AbstractSchema {
	_id: ObjectId | string;

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
