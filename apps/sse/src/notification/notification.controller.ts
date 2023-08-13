import { Body, Controller, Param, Post, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateNotificationsDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
@Controller('notifications')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Sse('listener')
	notificationListener(): Observable<Notification> {
		return this.notificationService.notificationListener();
	}

	@Sse('listener/:id')
	notificationListenerById(@Param('id') id: string): Observable<Notification> {
		return this.notificationService.notificationListenerById(id);
	}

	@Post()
	async createNotification(
		@Body() createNotificationsDto: CreateNotificationsDto,
	) {
		return await this.notificationService.createNotification(
			createNotificationsDto,
		);
	}
}
