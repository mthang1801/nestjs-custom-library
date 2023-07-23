import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import SchemaCustom from '../abstract/schema-option';
import { AbstractSchema } from '.';
@SchemaCustom({ collection: 'categories' })
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
