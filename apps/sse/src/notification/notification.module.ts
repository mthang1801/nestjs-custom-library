import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [NotificationService],
	exports: [NotificationService],
})
export class NotificationModule {}
