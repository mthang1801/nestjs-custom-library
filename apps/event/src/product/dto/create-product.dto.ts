import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Inventory } from '../../inventory/entities/inventory.entity';

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsPositive()
	price: number;

	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => Inventory)
	inventories: Partial<Inventory>[];
}
