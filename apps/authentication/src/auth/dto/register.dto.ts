import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	first_name: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	last_name: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}
