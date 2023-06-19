import { QUEUES, RabbitMQModule } from '@app/common';
import { Module } from '@nestjs/common';
import { RmqServiceController } from './app.controller';
import { RmqServiceService } from './app.service';

@Module({
	imports: [RabbitMQModule.registerAsync({ name: QUEUES.TEST })],
	controllers: [RmqServiceController],
	providers: [RmqServiceService],
})
export class RmqServiceModule {}
