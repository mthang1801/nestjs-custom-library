import { QUEUES, RabbitMQClientService } from '@app/shared';
import { MorganLogger } from '@app/shared/logger/morgan.logger';
import { WinstonLogger } from '@app/shared/logger/winston.logger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: WinstonLogger('Nest Library'),
	});
	app.use(MorganLogger());
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	const rabbitMQClientService = app.get<RabbitMQClientService>(
		RabbitMQClientService,
	);
	app.connectMicroservice(
		rabbitMQClientService.getConsumer({
			name: QUEUES.SAVE_ACTION,
			isAck: true,
		}),
	);
	await app.startAllMicroservices();
}
bootstrap();
