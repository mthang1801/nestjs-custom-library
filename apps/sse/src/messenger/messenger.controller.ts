import { Controller } from '@nestjs/common';
import { MessengerService } from './messenger.service';

@Controller('messenger')
export class MessengerController {
	constructor(private readonly messengerService: MessengerService) {}
}
