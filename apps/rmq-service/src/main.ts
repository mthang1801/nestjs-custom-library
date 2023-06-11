import { NestFactory } from '@nestjs/core';
import { QUEUES, RabbitMQService } from 'libs/common/src';
import { RmqServiceModule } from './rmq-service.module';

async function bootstrap() {
	const app = await NestFactory.create(RmqServiceModule);
	const rmqService = app.get<RabbitMQService>(RabbitMQService);
	[QUEUES.TEST, QUEUES.BROAD_CAST].map((item) =>
		app.connectMicroservice(rmqService.getOptions(item)),
	);
	await app.startAllMicroservices();
	await app.listen(3000);
}
bootstrap();
