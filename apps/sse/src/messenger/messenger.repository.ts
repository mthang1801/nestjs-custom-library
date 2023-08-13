import { AbstractRepository, CONNECTION_NAME } from '@app/shared';
import {
	Messenger,
	MessengerDocument,
} from '@app/shared/schemas/messenger.schema';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class MessengerRepository extends AbstractRepository<MessengerDocument> {
	logger = new Logger(MessengerRepository.name);
	constructor(
		@InjectModel(Messenger.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<MessengerDocument>,
		@InjectModel(Messenger.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<MessengerDocument>,
	) {
		super({ primaryModel, secondaryModel });
	}
}
