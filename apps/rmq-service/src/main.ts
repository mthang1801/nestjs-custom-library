import { QUEUES, RabbitMQService } from '@app/common';
import { Logger } from '@nestjs/common';
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
	await app.listen(5002, async () =>
		Logger.log(
			`Server is running on ${await app.getUrl()}`,
			'APPLICATION READY',
		),
	);
}
bootstrap();
