import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ENUM_STATUS } from '../constants/enum';

@Schema({ timestamps: true, versionKey: false })
export class Category {
	@Prop()
	name: string;

	@Prop({
		type: String,
		enum: Object.values(ENUM_STATUS),
		default: ENUM_STATUS.ACTIVE,
	})
	status: string;

	@Prop({ type: Number, default: 0 })
	level: number;

	@Prop({ type: String })
	path: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
	parent: Category;
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category);
