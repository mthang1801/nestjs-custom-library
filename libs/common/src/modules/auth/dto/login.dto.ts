import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	password: string;
}