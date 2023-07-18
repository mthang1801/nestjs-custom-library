import { Schema, SchemaOptions } from '@nestjs/mongoose';

const SchemaCustom = (properties?: SchemaOptions): ClassDecorator =>
	Schema({
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
		collection: properties?.collection,
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		...properties,
	});

export default SchemaCustom;
