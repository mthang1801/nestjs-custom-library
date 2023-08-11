import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { TelegramService } from 'nestjs-telegram';
import { AppModule } from './app.module';
import { ENUM_QUEUES, RMQClientService } from '@app/shared';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const telegramService = app.get<TelegramService>(TelegramService);
	const rmqService = app.get<RMQClientService>(RMQClientService);
	app.connectMicroservice<MicroserviceOptions>(
		rmqService.getConsumer({
			queue: ENUM_QUEUES.TEST_ACK,
			isAck: true,
			prefetchCount: 1,
		}),
	),
		await app.startAllMicroservices();
	// await app.listen(configService.get<number>('CLOUD_PORT'), async () => {
	// 	Logger.log(`Server is running on ${await app.getUrl()}`),
	// 		await telegramService
	// 			.sendMessage({
	// 				chat_id: configService.get<string>('TELEGRAM_GROUP_ID'),
	// 				text: `Server is running on ${await app.getUrl()}`,
	// 			})
	// 			.toPromise();
	// });
}
bootstrap();
