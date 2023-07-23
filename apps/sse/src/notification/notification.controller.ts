import { Body, Controller, Post, Sse } from '@nestjs/common';
import { CreateNotificationsDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
@Controller('notifications')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Sse('listener')
	async sseNotification() {
		return this.notificationService.sseNotification();
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
