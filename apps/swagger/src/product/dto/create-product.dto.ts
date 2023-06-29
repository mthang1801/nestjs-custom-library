import {
    ENUM_PRODUCT_VISIBILITY,
    ENUM_STATUS,
} from '@app/shared/constants/enum';
import { Category } from '@app/shared/schemas/category.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		description: 'product name',
		example: 'iPhone 14 Promax 256GB',
	})
	name: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(30)
	@ApiProperty({
		description: 'product sku',
		example: 'IPHONE14PROMAX256GB',
	})
	sku: string;

	@ApiPropertyOptional({
		description: 'Product Retail Price',
		example: 1099,
	})
	@IsPositive()
	@IsOptional()
	retail_price: number;

	@ApiPropertyOptional({
		description: 'Product Status',
		enum: ENUM_STATUS,
		example: ENUM_STATUS.ACTIVE,
	})
	@IsEnum(ENUM_STATUS)
	@IsOptional()
	status: ENUM_STATUS;

	@ApiPropertyOptional({
		description: 'Product visibility',
		type: [String],
		enum: ENUM_PRODUCT_VISIBILITY,
		example: [
			ENUM_PRODUCT_VISIBILITY.CATEGORY,
			ENUM_PRODUCT_VISIBILITY.PROMOTION,
		],
	})
	@IsArray()
	@IsOptional()
	@IsEnum(ENUM_PRODUCT_VISIBILITY, { each: true })
	visibility: ENUM_PRODUCT_VISIBILITY;

	@ApiPropertyOptional({
		description: 'Product short content',
		example:
			'iPhone 14 Pro Max 128GB Chính hãng (VN/A) chính thống giá RẺ HƠN CÁC LOẠI RẺ chỉ có tại Di Động Việt ',
	})
	@IsString()
	@IsOptional()
	@MaxLength(255)
	short_content: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		description: 'Product full content',
		example:
			'iPhone 14 Pro Max 128GB Chính hãng (VN/A) chính thống giá RẺ HƠN CÁC LOẠI RẺ chỉ có tại Di Động Việt ',
	})
	content: string;

	@IsArray()
	@IsString({ each: true })
	@ArrayMinSize(1)
	@ApiPropertyOptional({
		description: 'Meta Keywords',
		type: [String],
		example: ['iPhone 14', 'Pro max', '256GB'],
	})
	meta_keywords: string[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Category)
	categories: Partial<Category[]>;
}
