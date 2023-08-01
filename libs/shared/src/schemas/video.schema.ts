import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import SchemaCustom from '../abstract/schema-option';
import { AbstractDocument, AbstractSchema } from './abstract.schema';

@SchemaCustom({ collection: 'videos' })
export class Video extends AbstractSchema {
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

export type VideoDocument = AbstractDocument<Video>;

export const VideoSchema = SchemaFactory.createForClass(Video);
