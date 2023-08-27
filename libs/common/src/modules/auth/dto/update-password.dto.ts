import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SetPasswordDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	username: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	password: string;
}
