import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
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
	@IsString()
	password: string;

	salt: string;
}
