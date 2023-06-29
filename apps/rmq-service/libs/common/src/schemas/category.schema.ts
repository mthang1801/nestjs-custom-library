import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { AbstractSchema } from '.';

@Schema({
	collection: 'categories',
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Category extends AbstractSchema {
	@Prop()
	@ApiProperty({ description: 'category name', example: 'Phone' })
	name: string;

	@Prop()
	@ApiProperty({ description: 'category image', example: 'category-image.png' })
	image: string;

	@Prop()
	@ApiPropertyOptional({
		description: 'category parent',
		example: 'Default Category',
	})
	parent: string;

	@Prop()
	@ApiPropertyOptional({
		description: 'category ancestor path',
		example: '1/2/3/4',
	})
	path: string;

	@Prop()
	@ApiPropertyOptional({
		description: 'Category level in ancestor',
		example: 1,
	})
	level: number;
}

export type CategoryDocument = HydratedDocument<Document, Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);
