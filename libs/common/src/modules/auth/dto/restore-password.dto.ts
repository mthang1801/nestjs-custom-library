import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RestorePasswordDto {
	@IsNotEmpty()
	@ApiProperty({ example: 'username' })
	username: string;

	@IsNotEmpty()
	@ApiProperty({ example: '123456' })
	verify_code: string;

	@IsNotEmpty()
	@IsStrongPassword()
	@ApiProperty({ example: 'Aa@123456' })
	new_password: string;
}
