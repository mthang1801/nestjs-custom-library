import { AbstractService } from '@app/shared';
import {
	Notification,
	NotificationDocument,
} from '@app/shared/schemas/notification.schema';
import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import * as _ from 'lodash';
import { Subject, map } from 'rxjs';
import { CreateNotificationsDto } from './dto/create-notification.dto';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService extends AbstractService<NotificationDocument> {
	logger = new Logger(NotificationService.name);
	private readonly subject = new Subject();
	constructor(readonly notificationRepository: NotificationRepository) {
		super(notificationRepository);
	}
	@Timeout(Date.now().toString(), 500)
	async test() {
		const users = [
			{ user: 'barney', active: true },
			{ user: 'fred', active: false },
			{ user: 'pebbles', active: false },
		];

		console.log(_.dropWhile(users, 'active'));
	}

	sseNotification() {
		return this.subject
			.asObservable()
			.pipe(map((notification: Notification) => notification));
	}

	async createNotification(payload: CreateNotificationsDto) {
		const notification = await this._create(payload);
		if (notification) this.subject.next(notification);
		return notification;
	}
}
