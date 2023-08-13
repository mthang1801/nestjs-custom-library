import { Notification } from '@app/shared/schemas/notification.schema';
import { Injectable, Logger } from '@nestjs/common';
import { Subject, filter, map } from 'rxjs';
import { CreateNotificationsDto } from './dto/create-notification.dto';
import { NotificationRepository } from './notification.repository';

/**
 * WARNING: Không sử dụng với Request Scope
 */
@Injectable()
export class NotificationService {
	readonly logger = new Logger(NotificationService.name);
	private readonly subject = new Subject<Notification>();

	constructor(readonly notificationRepository: NotificationRepository) {}

	notificationListener(): any {
		return this.subject
			.asObservable()
			.pipe(map((notification: Notification) => JSON.stringify(notification)));
	}

	notificationListenerById(id: string): any {
		return this.subject.asObservable().pipe(
			filter((notification: Notification) => notification.receiver === id),
			map((notification: Notification) => notification),
		);
	}

	async createNotification(
		payload: CreateNotificationsDto,
	): Promise<Notification> {
		const notification = await this.notificationRepository.create(payload);
		if (notification) this.subject.next(notification);
		return notification;
	}
}
