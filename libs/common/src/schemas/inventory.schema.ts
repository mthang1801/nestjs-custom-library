import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Contact, ContactSchema } from './contact.schema';
import { Product } from './product.schema';

@Schema({ versionKey: false, autoCreate: true })
export class Inventory {
	@Prop({ type: ContactSchema })
	@Type(() => Contact)
	public contact: Contact;

	@Prop()
	public stock_quantity: number;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	})
	public product: Product;
}

export type InventoryDocument = Inventory & Document;

export const InventorySchema = SchemaFactory.createForClass(Inventory);
