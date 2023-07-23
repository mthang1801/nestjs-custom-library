import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v1 as uuidv1 } from 'uuid';
import SchemaCustom from '../abstract/schema-option';
import { AbstractSchema } from './abstract.schema';

@SchemaCustom({ collection: 'notifications', timestamps: true })
export class Notification extends AbstractSchema {
	@Prop({ type: String, default: uuidv1 })
	_id: string;

	@Prop({ type: String })
	title: string;

	@Prop({ type: String })
	description: string;

	@Prop({ type: Boolean, default: false })
	isSeen: boolean;
}

export type NotificationDocument = HydratedDocument<Document, Notification>;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
