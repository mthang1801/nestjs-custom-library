import { ENUM_STATUS } from '@app/common/constants/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from 'apps/mongo-service/src/category/entities/category.entity';
import { Exclude, Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Inventory } from './inventory.schema';
import { ProductSEO, ProductSEOSchema } from './product-seo.schema';

@Schema({ timestamps: true, versionKey: false, autoCreate: true })
export class Product {
	@Prop({ type: mongoose.Schema.Types.ObjectId })
	@Transform(({ value }) => {
		console.log('Product::', value);
		return value.obj._id.toString();
	})
	_id: string;

	@Prop({ maxlength: 255, required: true, set: (name) => name.toLowerCase() })
	name: string;

	@Prop({ unique: true })
	sku: string;

	@Prop({ unique: true })
	@Exclude()
	barcode: string;

	@Prop({ type: mongoose.Schema.Types.Number, default: 0 })
	price: number;

	@Prop()
	short_description: string;

	@Prop()
	description: string;

	@Prop({
		type: String,
		enum: Object.values(ENUM_STATUS),
		default: ENUM_STATUS.ACTIVE,
	})
	status: ENUM_STATUS;

	@Prop({ type: ProductSEOSchema })
	@Type(() => ProductSEO)
	seo: ProductSEO;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }] })
	@Type(() => Inventory)
	inventories: Inventory[];

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
	categories: Category[];
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
