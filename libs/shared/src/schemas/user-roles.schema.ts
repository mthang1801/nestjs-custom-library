import { ENUM_ROLES } from '@app/shared/constants/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractSchema } from './abstract.schema';

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
	name: ENUM_ROLES;

	@Prop()
	description: string;
}

export type UserRoleDocument = HydratedDocument<Document, UserRole>;

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
