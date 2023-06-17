import { ENUM_LANGUAGES } from '@app/common/constants/enum';
import { ContactDTO } from '@app/common/dto/contact.dto';
import { UserRole } from '@app/common/schemas';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@MaxLength(50)
	first_name: string;

	@IsNotEmpty()
	@MaxLength(50)
	last_name: string;

	@IsNotEmpty()
	@IsEmail()
	@MaxLength(50)
	email: string;

	@IsOptional()
	@IsPhoneNumber('VN')
	phone: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;

	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => ContactDTO)
	contact: ContactDTO[];

	@IsArray()
	@IsOptional()
	@ArrayMinSize(1)
	@IsEnum(ENUM_LANGUAGES, { each: true })
	languges: ENUM_LANGUAGES[];

	@IsNotEmpty()
	role: UserRole;
}
