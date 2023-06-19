import { QUEUES, RabbitMQService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqServiceModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(RmqServiceModule);
	const rmqService = app.get<RabbitMQService>(RabbitMQService);
	[QUEUES.TEST, QUEUES.BROAD_CAST].map((item) =>
		app.connectMicroservice<MicroserviceOptions>(rmqService.getOptions(item)),
	);
	await app.startAllMicroservices();
	await app.listen(5002);
}
bootstrap();
