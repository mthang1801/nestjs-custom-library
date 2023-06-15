import { ENUM_STATUS } from '@app/common/constants/enum';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ProductSEODto } from './product-seo.dto';

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsPositive()
	price: number;

	@IsNotEmpty()
	@IsString()
	sku: string;

	@IsNotEmpty()
	@IsString()
	barcode: string;

	@IsString()
	@IsOptional()
	short_description: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsOptional()
	@IsEnum(Object.values(ENUM_STATUS))
	status: ENUM_STATUS;

	@IsOptional()
	@Type(() => ProductSEODto)
	seo: ProductSEODto;

	@IsOptional()
	@IsArray()
	categories: number[];
}
