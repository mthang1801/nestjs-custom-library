import { AbstractCreate } from '@app/shared/abstract/dto/abstract-create.dto';
import { ENUM_STATUS } from '@app/shared/constants/enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto extends AbstractCreate {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsOptional()
	@IsEnum(ENUM_STATUS)
	status: ENUM_STATUS;

	@IsOptional()
	@IsString()
	short_content: string;

	@IsOptional()
	@IsString()
	content: string;

	@IsOptional()
	@IsString()
	thumnail: string;

	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	meta_keywords: string[];
}
