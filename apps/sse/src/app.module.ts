import { MongooseDynamicModule } from '@app/shared';
import { LibCoreModule } from '@app/shared/core/core.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationModule } from './notification/notification.module';

@Module({
	imports: [
		LibCoreModule,
		MongooseDynamicModule.forRootAsync(),
		NotificationModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
