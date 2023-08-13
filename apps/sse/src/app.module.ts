import { AllExceptionsFilter, LibMongoModule } from '@app/shared';
import { LibCoreModule } from '@app/shared/core/core.module';
import { TransformInterceptor } from '@app/shared/interceptors/transform.interceptor';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { NotificationModule } from './notification/notification.module';
import { MessengerModule } from './messenger/messenger.module';

@Module({
	imports: [
		LibCoreModule,
		LibMongoModule.forRootAsync(),
		NotificationModule,
		MessengerModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
	],
})
export class AppModule {}
