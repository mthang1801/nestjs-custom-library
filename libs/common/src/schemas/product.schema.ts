import { ENUM_STATUS } from '@app/common/constants/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Inventory } from './inventory.schema';
import { ProductSEO, ProductSEOSchema } from './product-seo.schema';

@Schema({ timestamps: true, versionKey: false, autoCreate: true })
export class Product {
	@Prop({ maxlength: 255, required: true })
	name: string;

	@Prop({ unique: true })
	sku: string;

	@Prop({ unique: true })
	barcode: string;

	@Prop({ type: mongoose.Schema.Types.Number, default: 0 })
	price: number;

	@Prop()
	short_description: string;

	@Prop()
	description: string;

	@Prop({ type: String, enum: ENUM_STATUS, default: ENUM_STATUS.ACTIVE })
	status: ENUM_STATUS;

	@Prop({ type: ProductSEOSchema })
	@Type(() => ProductSEO)
	seo: ProductSEO;

	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'inventories' }],
	})
	@Type(() => Inventory)
	inventories: Inventory[];
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
