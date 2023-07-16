import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';

import { Category } from 'apps/rmq-service/libs/common/src/schemas/category.schema';
import { AbstractSchema } from '.';
import { ENUM_STATUS } from '../constants/enum';
import { User } from './user.schema';

@Schema({
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	collection: 'posts',
	strict: false,
})
export class Posts extends AbstractSchema {
	@Prop({
		type: String,
		required: true,
	})
	title: string;

	@Prop({ type: String, enum: ENUM_STATUS, default: ENUM_STATUS.ACTIVE })
	status: ENUM_STATUS;

	@Prop({
		get: (short_content: string) => `<strong>${short_content}</strong>`,
	})
	short_content: string;

	@Prop({
		get: (content: string) => content?.repeat(10),
	})
	content: string;

	@Prop()
	thumbnail: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
	@Type(() => User)
	author: User;

	@Prop({ type: Number, default: 0 })
	@Exclude()
	view_count: number;

	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }],
	})
	@Type(() => Category)
	categories: Category[];
}

export type PostsDocument = HydratedDocument<Document, Posts>;

export const PostsSchema = SchemaFactory.createForClass(Posts);

export const PostsSchemaFactory = () => {
	const postsSchema = PostsSchema;
	postsSchema.index({ title: 'text' });
	postsSchema.index({ title: 'text', content: 'text' });
	return postsSchema;
};
