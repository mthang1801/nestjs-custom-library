import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	@IsString()
	sku: string;

	@IsNotEmpty()
	@IsString()
	barcode: string;

	@IsOptional()
	description: string;

	@IsPositive()
	price: number;

	@IsDate()
	@IsOptional()
	createdAt: Date = new Date();

	@IsOptional()
	categories: string[];
}
