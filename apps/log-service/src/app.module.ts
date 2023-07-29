import {
  ENUM_QUEUES,
  LibRabbitMQModule,
  MongooseDynamicModule,
} from '@app/shared';
import { LibCoreModule } from '@app/shared/core/core.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		LibCoreModule,
		LibRabbitMQModule.registerAsync({ name: ENUM_QUEUES.SAVE_ACTION }),
		MongooseDynamicModule.forRootAsync(),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
