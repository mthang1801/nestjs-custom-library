import { IsDate, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateProductDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	description: string;

	@IsPositive()
	price: number;

	@IsDate()
	@IsOptional()
	createdAt: Date = new Date();
}
