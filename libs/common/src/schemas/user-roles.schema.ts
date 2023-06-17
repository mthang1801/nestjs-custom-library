import { ENUM_ROLES } from '@app/common/constants/enum';
import { AbstractSchema } from '@app/common/mongoose/abstract/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	toJSON: { virtuals: true, getters: true },
	collection: 'user_roles',
})
export class UserRole extends AbstractSchema {
	@Prop({
		type: String,
		unique: true,
		required: true,
		enum: ENUM_ROLES,
		default: ENUM_ROLES.USER,
	})
	name: string;

	@Prop()
	description: string;
}

export type UserRoleDocument = HydratedDocument<Document, UserRole>;

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
