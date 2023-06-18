import { AbstractSchema } from '@app/shared/abstract';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
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

	@Prop()
	short_content: string;

	@Prop()
	content: string;

	@Prop()
	thumbnail: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
	@Type(() => User)
	author: User;
}

export type PostsDocument = HydratedDocument<Document, Posts>;

export const PostsSchema = SchemaFactory.createForClass(Posts);

export const PostsSchemaFactory = () => {
	const postsSchema = PostsSchema;
	postsSchema.index({ title: 'text' });
	postsSchema.index({ title: 'text', content: 'text' });
	return postsSchema;
};
