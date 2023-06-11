import { Module } from '@nestjs/common';
import { QUEUES, RabbitMQModule } from 'libs/common/src';
import { RmqServiceController } from './rmq-service.controller';
import { RmqServiceService } from './rmq-service.service';

@Module({
	imports: [RabbitMQModule.registerAsync({ name: QUEUES.TEST })],
	controllers: [RmqServiceController],
	providers: [RmqServiceService],
})
export class RmqServiceModule {}
