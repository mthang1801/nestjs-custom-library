import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessengerDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	content: string;

	@ApiProperty()
	receiver: string;
}
