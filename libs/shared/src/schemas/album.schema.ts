import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import SchemaCustom from '../abstract/schema-option';
import { AbstractDocument, AbstractSchema } from './abstract.schema';

@SchemaCustom({ collection: 'albums' })
export class Album extends AbstractSchema {
	@Prop()
	@ApiPropertyOptional()
	filename: string;

	@Prop()
	@ApiPropertyOptional()
	path: string;

	@Prop()
	@ApiPropertyOptional()
	mimetype: string;
}

export type AlbumDocument = AbstractDocument<Album>;
export const AlbumSchema = SchemaFactory.createForClass(Album);
