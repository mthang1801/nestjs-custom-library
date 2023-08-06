import { ENUM_QUEUES, LibRabbitMQModule } from '@app/shared';
import { TransformInterceptor } from '@app/shared/interceptors/transform.interceptor';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RmqServiceController } from './app.controller';
import { RmqServiceService } from './app.service';
import { PublishModule } from './publish/publish.module';

@Module({
	imports: [
		LibRabbitMQModule.registerAsync({ name: ENUM_QUEUES.TEST }),
		PublishModule,
	],
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
