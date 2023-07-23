import { ENUM_GENDER, ENUM_LANGUAGES } from '@app/shared/constants/enum';
import {
	AbstractSchema,
	Contact,
	ContactSchema,
	Posts,
	PostsDocument,
	UserRole,
} from '@app/shared/schemas';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { NextFunction } from 'express';
import * as _ from 'lodash';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import SchemaCustom from '../abstract/schema-option';

@SchemaCustom()
export class User extends AbstractSchema {
	@Prop({
		required: true,
		minlength: 2,
		maxlength: 60,
		set: (first_name: string) => _.capitalize(first_name.trim()),
	})
	@ApiProperty({ description: 'First Name', example: 'John' })
	first_name: string;

	@Prop({
		required: true,
		minlength: 2,
		maxlength: 60,
		set: (last_name: string) => _.capitalize(last_name.trim()),
	})
	@ApiProperty({ description: 'Last Name', example: 'Doe' })
	last_name: string;

	@Prop({
		unique: true,
		required: true,
		match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
		get: (email) => {
			if (email) {
				const firstFourCharacters = email.slice(0, 4);
				return `${firstFourCharacters}*******@${email.split('@').at(-1)}`;
			}
			return email;
		},
	})
	email: string;

	@Prop({
		required: true,
	})
	@Exclude()
	password: string;

	@Prop({
		type: [String],
		enum: ENUM_LANGUAGES,
	})
	languages: ENUM_LANGUAGES[];

	@Prop({
		type: String,
		match:
			/((03|05|07|08|09)+([0-9]{8}))\b|((02)+([0-9]{9}))\b|(^(19)+([0-9]{6,8}))\b|(^(18)+([0-9]){6,8})\b/,
		get: (phone: string) => {
			if (!phone) return;
			const lastFourDigits = phone.slice(phone.length - 4);
			return `***-*******${lastFourDigits}`;
		},
		index: true,
	})
	phone: string;

	@Prop({
		default:
			'https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg',
	})
	avatar: string;

	@Prop()
	dob: Date;

	@Prop({ type: String, enum: ENUM_GENDER })
	gender: ENUM_GENDER;

	@Prop({ default: 0 })
	point: number;

	@Prop({ type: [{ type: ContactSchema }] })
	@Type(() => Contact)
	contact: Contact[];

	@Prop({
		default: 'xxxx-xxxx-xxxx',
	})
	@Exclude()
	credit_card_number: string;

	@Prop({ default: 999 })
	@Exclude()
	cvc: number;

	@Prop({ default: 'xxxxxxxxxxxxx' })
	@Exclude()
	identifier: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserRole',
	})
	@Type(() => UserRole)
	@Transform(
		({ value }) => {
			return value?.name?.toString();
		},
		{ toClassOnly: true },
	)
	@Exclude()
	role: UserRole;

	@Expose({ name: 'full_name' })
	get fullName(): string {
		return [this.first_name, this.last_name].filter(Boolean).join(' ');
	}

	@Type(() => Posts)
	posts: Posts[];

	// Apply for authentication
	@Prop({ index: true })
	refresh_token: string;

	// Apply for advanced-auth
	@Prop({ index: 1 })
	refresh_token_list: string;

	constructor(partial: Partial<UserDocument>) {
		super();
		Object.assign(this, partial);
	}
}

export type UserDocument = HydratedDocument<Document, User>;

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaFactory = (postModel: Model<PostsDocument>) => {
	const userSchema = UserSchema;
	userSchema.index({ first_name: 1, last_name: 1 });
	userSchema.index({ updated_at: -1 });

	userSchema.post('findOneAndUpdate', async function (next: NextFunction) {
		const user = await this.model.findOne(this.getFilter());

		if (user.deleted_at) {
			await postModel
				.updateMany({ author: user }, { $set: { deleted_at: new Date() } })
				.exec();
		} else {
			await postModel
				.updateMany({ author: user }, { $set: { deleted_at: new Date() } })
				.exec();
		}
	});
	userSchema.virtual('default_address').get(function (this: UserDocument) {
		if (this.contact.length) {
			const firstContact = this.contact[0];
			return [
				firstContact.address,
				firstContact.ward_name,
				firstContact.district_name,
				firstContact.province_name,
			]
				.filter(Boolean)
				.join(', ');
		}
		return 'Đang cập nhật';
	});

	userSchema.virtual('posts', {
		ref: 'Posts',
		localField: '_id',
		foreignField: 'author',
	});
	return userSchema;
};
