import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDto {
	@ApiProperty({ example: 'example@gmail.com' })
	@IsNotEmpty()
	@IsString()
	username: string;
}
