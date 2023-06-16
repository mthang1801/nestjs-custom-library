import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Contact, ContactSchema } from './contact.schema';

@Schema()
export class User {
	@Transform(({ value }) => value.toString())
	_id: string;

	@Prop({ unique: true })
	email: string;

	@Prop()
	first_name: string;

	@Prop()
	last_name: string;

	@Prop()
	@Exclude()
	password: string;

	@Prop({ type: ContactSchema })
	@Type(() => Contact)
	address: Contact;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
