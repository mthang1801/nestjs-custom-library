import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class ProductSEO {
	@Prop()
	meta_title: string;

	@Prop()
	meta_description: string;

	@Prop()
	meta_image: string;

	@Prop({ type: [String] })
	meta_keyword: string[];

	@Prop()
	canonical: string;
}

export type ProductSEODocument = ProductSEO & Document;

export const ProductSEOSchema = SchemaFactory.createForClass(ProductSEO);
