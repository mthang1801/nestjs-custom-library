import { QUEUES, RabbitMQModule } from '@app/shared';
import { TransformInterceptor } from '@app/shared/interceptors/transform.interceptor';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RmqServiceController } from './app.controller';
import { RmqServiceService } from './app.service';
import { ReportModule } from './report/report.module';

@Module({
	imports: [RabbitMQModule.registerAsync({ name: QUEUES.TEST }), ReportModule],
	controllers: [RmqServiceController],
	providers: [
		RmqServiceService,
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
	],
})
export class RmqServiceModule {}
