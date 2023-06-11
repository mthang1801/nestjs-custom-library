export class ProductCreatedEvent {
	id: number;
	name: string;
	price: number;
	createdAt: Date;

	constructor(params: Partial<ProductCreatedEvent>) {
		Object.assign(this, params);
	}
}
