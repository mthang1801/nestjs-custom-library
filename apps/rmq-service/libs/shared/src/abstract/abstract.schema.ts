import { ENUM_MODEL } from '@app/shared/constants/enum';
import { User } from '@app/shared/schemas';
import { Prop, Schema } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';

@Schema()
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

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: ENUM_MODEL.USER })
	deleted_by: Date;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: ENUM_MODEL.USER })
	created_by?: User;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: ENUM_MODEL.USER })
	updated_by?: User;
}
