import { AbstractService } from '@app/shared';
import { MessengerDocument } from '@app/shared/schemas/messenger.schema';
import { Injectable, Logger } from '@nestjs/common';
import { MessengerRepository } from './messenger.repository';

@Injectable()
export class MessengerService extends AbstractService<MessengerDocument> {
	logger = new Logger(MessengerService.name);
	constructor(readonly messengerRepository: MessengerRepository) {
		super(messengerRepository);
	}
}
