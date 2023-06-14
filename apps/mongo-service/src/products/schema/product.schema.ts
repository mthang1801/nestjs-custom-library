import { ENUM_STATUS } from '@app/common/constants/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Product {
	@Prop({ maxlength: 255, required: true })
	name: string;

	@Prop({ type: mongoose.Schema.Types.Number, default: 0 })
	price: number;

	@Prop()
	short_description: string;

	@Prop()
	description: string;

	@Prop({ type: String, enum: ENUM_STATUS, default: ENUM_STATUS.ACTIVE })
	status: ENUM_STATUS;
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
