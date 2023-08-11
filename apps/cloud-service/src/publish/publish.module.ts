import { ENUM_QUEUES, LibRabbitMQModule } from '@app/shared';
import { LibUtilModule } from '@app/shared/utils/util.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PublishController } from './publish.controller';
import { PublishService } from './publish.service';
@Module({
	imports: [
		ScheduleModule.forRoot(),
		LibUtilModule,
		LibRabbitMQModule.registerAsync({ name: ENUM_QUEUES.TEST_ACK }),
	],
	controllers: [PublishController],
	providers: [PublishService],
})
export class PublishModule {}
