export class Product {
	id: string;
	name: string;
	price: number;
	created_at: Date;
	updated_at: Date;

	constructor(data: Partial<Product>) {
		delete data['inventories'];
		Object.assign(this, data);
	}
}
