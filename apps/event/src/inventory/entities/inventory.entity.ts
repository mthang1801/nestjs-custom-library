import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { Product } from '../../product/entities/product.entity';

export class Inventory {
	@IsOptional()
	name: string;

	@IsOptional()
	@Type(() => Product)
	product: Product;

	@IsPositive()
	quantity: number;

	price: number;

	total_price: number;

	created_at: Date = new Date();
	updated_at: Date = new Date();

	constructor(payload: Partial<Inventory>) {
		Object.assign(this, payload);
	}
}
