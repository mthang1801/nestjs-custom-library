import { QUEUES, RabbitMQModule } from '@app/common';
import { TransformInterceptor } from '@app/common/interceptors/transform.interceptor';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RmqServiceController } from './app.controller';
import { RmqServiceService } from './app.service';

@Module({
	imports: [RabbitMQModule.registerAsync({ name: QUEUES.TEST })],
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
