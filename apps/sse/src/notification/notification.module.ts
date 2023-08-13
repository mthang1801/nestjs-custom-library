import { LibMongoModule } from '@app/shared';
import {
	Notification,
	NotificationSchema,
} from '@app/shared/schemas/notification.schema';
import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

@Module({
	imports: [
		LibMongoModule.forFeatureAsync({
			name: Notification.name,
			schema: NotificationSchema,
		}),
	],
	controllers: [NotificationController],
	providers: [NotificationService, NotificationRepository],
	exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
