import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
	@IsNotEmpty()
	receiver_id: string | any;

	@IsNotEmpty()
	text: string;
}
