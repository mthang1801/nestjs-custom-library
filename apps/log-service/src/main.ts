import { ENUM_QUEUES } from '@app/shared';
import { MorganLogger } from '@app/shared/logger/morgan.logger';
import { WinstonLogger } from '@app/shared/logger/winston.logger';
import { RMQClientService } from '@app/shared/rabbitmq/rabbitmq-client.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: WinstonLogger('Log SVC'),
	});
	app.use(MorganLogger());
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	const rmqService = app.get<RMQClientService>(RMQClientService);
	app.connectMicroservice<MicroserviceOptions>(
		rmqService.getConsumer({ queue: ENUM_QUEUES.SAVE_ACTION, isAck: true }),
	);
	await app.startAllMicroservices();
}
bootstrap();
