import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import SchemaCustom from '../abstract/schema-option';
import {
  ENUM_MESSENGER_SCOPE,
  ENUM_MESSENGER_TYPE,
  ENUM_STATUS,
} from '../constants/enum';
import { AbstractDocument, AbstractSchema } from './abstract.schema';
import { User } from './user.schema';

@SchemaCustom({ collection: 'messenger' })
export class Messenger extends AbstractSchema {
	@Prop()
	content: string;

	@Prop({
		type: String,
		enum: ENUM_MESSENGER_TYPE,
		default: ENUM_MESSENGER_TYPE.TEXT,
	})
	messenger_type: string;

	@Prop()
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
	sender: User;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
	receiver: User;

	@Prop({ type: String, enum: ENUM_STATUS, default: ENUM_STATUS.ACTIVE })
	status: ENUM_STATUS;

	@Prop({
		type: String,
		enum: ENUM_MESSENGER_SCOPE,
		default: ENUM_MESSENGER_SCOPE.PRIVATE,
	})
	scope: string;
}

export type MessengerDocument = AbstractDocument<Messenger>;

export const MessengerSchema = SchemaFactory.createForClass(Messenger);
