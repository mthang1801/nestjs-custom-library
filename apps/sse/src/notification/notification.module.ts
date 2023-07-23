import { MongooseDynamicModule } from '@app/shared';
import {
  Notification,
  NotificationSchema,
} from '@app/shared/schemas/notification.schema';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		MongooseDynamicModule.forFeatureAsync({
			name: Notification.name,
			schema: NotificationSchema,
		}),
	],
	providers: [NotificationService],
	exports: [NotificationService],
})
export class NotificationModule {}
