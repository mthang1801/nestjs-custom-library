import { AllExceptionsFilter, MongooseDynamicModule } from '@app/shared';
import { LibCoreModule } from '@app/shared/core/core.module';
import { TransformInterceptor } from '@app/shared/interceptors/transform.interceptor';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { NotificationModule } from './notification/notification.module';

@Module({
	imports: [
		LibCoreModule,
		MongooseDynamicModule.forRootAsync(),
		NotificationModule,
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
