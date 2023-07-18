import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { AbstractSchema } from '.';
import SchemaCustom from '../abstract/schema-option';
import { ENUM_PRODUCT_VISIBILITY, ENUM_STATUS } from '../constants/enum';
import { typeOf } from '../utils/function.utils';
import { Category } from './category.schema';

@SchemaCustom()
export class Product extends AbstractSchema {
	@Prop({ type: String, required: true })
	@ApiProperty({
		description: 'product name',
		example: 'iPhone 14 Promax 256GB',
	})
	name: string;

	@Prop({ type: String, required: true, maxlength: 30 })
	@ApiProperty({
		description: 'product sku',
		example: 'IPHONE14PROMAX256GB',
	})
	sku: string;

	@Prop({
		type: mongoose.Schema.Types.Number,
		min: 0,
		default: 0,
		validate: (value: number) =>
			typeOf(value) === 'number' ? value > 0 : true,
	})
	@ApiPropertyOptional({
		description: 'Product Retail Price',
		example: 1099,
	})
	retail_price: number;

	@Prop({ type: String, maxlength: 255 })
	@ApiPropertyOptional({
		description: 'Product short content',
		example:
			'iPhone 14 Pro Max 128GB Chính hãng (VN/A) chính thống giá RẺ HƠN CÁC LOẠI RẺ chỉ có tại Di Động Việt ',
	})
	short_content: string;

	@Prop({ type: String })
	@ApiPropertyOptional({
		description: 'Product full content',
		example:
			'iPhone 14 Pro Max 128GB Chính hãng (VN/A) chính thống giá RẺ HƠN CÁC LOẠI RẺ chỉ có tại Di Động Việt ',
	})
	content: string;

	@Prop({ type: String, enum: ENUM_STATUS, default: ENUM_STATUS.ACTIVE })
	@ApiPropertyOptional({
		description: 'Product Status',
		enum: ENUM_STATUS,
		example: ENUM_STATUS.ACTIVE,
	})
	status: ENUM_STATUS;

	@Prop({
		type: [
			{
				type: String,
				enum: ENUM_PRODUCT_VISIBILITY,
				default: [],
			},
		],
	})
	visibility: ENUM_PRODUCT_VISIBILITY[];

	@Prop({ type: [String] })
	@ApiPropertyOptional({
		description: 'Meta Keywords',
		type: [String],
		example: ['iPhone 14', 'Pro max', '256GB'],
	})
	meta_keywords: string[];

	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }],
	})
	@ApiPropertyOptional({ type: () => [Category] })
	categories: Category[];
}

export type ProductDocument = HydratedDocument<Document, Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);
