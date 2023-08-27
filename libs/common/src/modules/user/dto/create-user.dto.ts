import { ENUM_GENDER, ENUM_STATUS } from '@app/shared/constants/enum';
import { BaseCreateDto } from '@app/shared/dto/base-create.dto';
import { ContactDTO } from '@app/shared/dto/contact.dto';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateUserDto extends PartialType(BaseCreateDto) {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(64)
	first_name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	last_name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsPhoneNumber('VN', { each: true })
	phone: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	avatar: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsDate()
	dob: Date;

	@ApiPropertyOptional()
	@IsOptional()
	@IsEnum(ENUM_GENDER)
	gender: ENUM_GENDER;

	@ApiPropertyOptional({ type: String, enum: ENUM_STATUS })
	@IsOptional()
	@IsEnum(ENUM_STATUS)
	status: ENUM_STATUS = ENUM_STATUS.ACTIVE;

	@ApiPropertyOptional()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => ContactDTO)
	contact: ContactDTO[];

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MaxLength(32)
	password: string;
}
