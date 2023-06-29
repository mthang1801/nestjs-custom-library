import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class ContactDTO {
	@IsOptional()
	province_id: string;

	@IsString()
	@IsNotEmpty()
	province_name: string;

	@IsOptional()
	district_id: string;

	@IsString()
	@IsNotEmpty()
	district_name: string;

	@IsOptional()
	ward_id: string;

	@IsString()
	@IsNotEmpty()
	ward_name: string;

	@IsString()
	@IsNotEmpty()
	address: string;

	@IsString()
	@IsPhoneNumber('VN')
	@IsNotEmpty()
	phone: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsOptional()
	fax: string;
}
