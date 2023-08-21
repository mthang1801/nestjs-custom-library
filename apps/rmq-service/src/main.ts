import { ENUM_QUEUES, RMQClientService } from '@app/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqServiceModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(RmqServiceModule);

	await app.listen(5002, async () =>
		Logger.log(
			`Server is running on ${await app.getUrl()}`,
			'APPLICATION READY',
		),
	);
}
bootstrap();
