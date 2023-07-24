import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import SchemaCustom from '../abstract/schema-option';
import { AbstractSchema } from './abstract.schema';
import { NotificationObject } from './notification-object.schema';

@SchemaCustom({ collection: 'notifications', timestamps: true })
export class Notification extends AbstractSchema {
	@Prop({ type: String })
	title: string;

	@Prop({ type: String })
	description: string;

	@Prop({ type: Boolean, default: false })
	isSeen: boolean;

	@Prop({ type: NotificationObject })
	object: NotificationObject;
}

export type NotificationDocument = HydratedDocument<Document, Notification>;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
