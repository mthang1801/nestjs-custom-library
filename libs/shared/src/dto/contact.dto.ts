import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class ContactDTO {
	@IsOptional()
	province_id: string;

	@IsString()
	@IsOptional()
	province_name: string;

	@IsOptional()
	district_id: string;

	@IsString()
	@IsOptional()
	district_name: string;

	@IsOptional()
	ward_id: string;

	@IsString()
	@IsOptional()
	ward_name: string;

	@IsString()
	@IsOptional()
	address: string;

	@IsString()
	@IsPhoneNumber('VN')
	@IsOptional()
	phone: string;

	@IsEmail()
	@IsOptional()
	email: string;

	@IsString()
	@IsOptional()
	fax: string;
}
