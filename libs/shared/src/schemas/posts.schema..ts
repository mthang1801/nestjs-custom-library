import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';

import SchemaCustom from '../abstract/schema-option';
import { ENUM_STATUS } from '../constants/enum';
import { AbstractSchema } from './abstract.schema';
import { Category } from './category.schema';
import { User } from './user.schema';

@SchemaCustom({ strict: false })
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
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
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
