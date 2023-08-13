import { CONNECTION_NAME } from '@app/shared';
import { AbstractRepository } from '@app/shared/abstract';
import {
  Notification,
  NotificationDocument,
} from '@app/shared/schemas/notification.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationRepository extends AbstractRepository<NotificationDocument> {
	protected logger = new Logger(NotificationRepository.name);

	constructor(
		@InjectModel(Notification.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<NotificationDocument>,
		@InjectModel(Notification.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<NotificationDocument>,
	) {
		super({ primaryModel, secondaryModel });
	}
}
