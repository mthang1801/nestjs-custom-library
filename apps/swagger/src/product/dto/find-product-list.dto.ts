import {
    ENUM_PRODUCT_VISIBILITY,
    ENUM_STATUS,
} from '@app/shared/constants/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class FindProductListDto {
	@ApiPropertyOptional({
		description: 'Items per page',
		name: 'limit',
		example: 10,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	limit?: number;

	@ApiPropertyOptional({
		description: 'Current page',
		name: 'page',
		example: 1,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	page?: number;

	@ApiPropertyOptional({ description: 'keyword to search', example: 'iphone' })
	@IsOptional()
	@IsString()
	q?: string;

	@ApiPropertyOptional({
		description: 'Status Product',
		enum: ENUM_STATUS,
		example: ENUM_STATUS.ACTIVE,
	})
	@IsOptional()
	@IsString()
	status?: ENUM_STATUS;

	@ApiPropertyOptional({
		description: 'The visibility of product',
		enum: ENUM_PRODUCT_VISIBILITY,
		isArray: true,
		example: [
			ENUM_PRODUCT_VISIBILITY.CATEGORY,
			ENUM_PRODUCT_VISIBILITY.PROMOTION,
		],
	})
	@IsOptional()
	@IsString()
	@IsArray()
	@IsEnum(ENUM_PRODUCT_VISIBILITY, { each: true })
	visibility: ENUM_PRODUCT_VISIBILITY[];
}
