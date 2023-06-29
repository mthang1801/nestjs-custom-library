import { ENUM_STATUS } from '@app/shared/constants/enum';
import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	title: string;

	@IsOptional()
	@IsEnum(ENUM_STATUS)
	status: ENUM_STATUS;

	@IsString()
	@IsOptional()
	short_content: string;

	@IsString()
	@IsOptional()
	content: string;

	@IsString()
	@IsOptional()
	thumbnail: string;

	@IsNotEmpty()
	@IsMongoId()
	author: string;
}
