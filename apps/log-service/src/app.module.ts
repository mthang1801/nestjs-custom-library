import { ENUM_QUEUES, LibMongoModule, LibRabbitMQModule } from '@app/shared';
import { LibCoreModule } from '@app/shared/core/core.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		LibCoreModule,
		LibRabbitMQModule.registerAsync({ name: ENUM_QUEUES.LOGGING_ACTION }),
		LibMongoModule.forRootAsync(),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
