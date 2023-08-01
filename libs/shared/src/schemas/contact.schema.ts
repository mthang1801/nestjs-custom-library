import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import SchemaCustom from '../abstract/schema-option';
import { AbstractDocument } from './abstract.schema';
import { Document } from 'mongoose';

@SchemaCustom({
	_id: false,
	timestamps: false,
	versionKey: false,
	autoCreate: true,
	toJSON: { getters: true },
})
@Expose()
export class Contact {
	@Prop()
	province_id: string;

	@Prop()
	province_name: string;

	@Prop()
	district_id: string;

	@Prop()
	district_name: string;

	@Prop()
	ward_id: string;

	@Prop()
	ward_name: string;

	@Prop()
	address: string;

	@Prop({
		get: (phone: string) => {
			if (!phone) return;
			const lastFourDigits = phone.slice(phone.length - 4);
			return `*********${lastFourDigits}`;
		},
	})
	phone: string;

	@Prop()
	fax: string;

	@Prop()
	email: string;
}

export type ContactDocument = Document & Contact;

export const ContactSchema = SchemaFactory.createForClass(Contact);
