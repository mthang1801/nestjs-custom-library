import { ENUM_STATUS } from '@app/common/constants/enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsPositive()
	price: number;

	@IsString()
	@IsOptional()
	short_description: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsOptional()
	@IsEnum(Object.values(ENUM_STATUS))
	status: ENUM_STATUS;
}
