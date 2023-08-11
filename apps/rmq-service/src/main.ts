import { ENUM_QUEUES, RMQClientService } from '@app/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqServiceModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(RmqServiceModule);
	// const rmqService = app.get<RMQClientService>(RMQClientService);
	// [ENUM_QUEUES.TEST, ENUM_QUEUES.BROAD_CAST].map((item) =>
	// 	app.connectMicroservice<MicroserviceOptions>(rmqService.getOptions(item)),
	// );
	// app.connectMicroservice<MicroserviceOptions>(
	// 	rmqService.getConsumer({ queue: ENUM_QUEUES.TEST_ACK, isAck: true }),
	// ),
	// 	await app.startAllMicroservices();
	await app.listen(5002, async () =>
		Logger.log(
			`Server is running on ${await app.getUrl()}`,
			'APPLICATION READY',
		),
	);
}
bootstrap();
