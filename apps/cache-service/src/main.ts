import { WinstonLogger } from '@app/shared/logger/winston.logger';
import { LibTelegramService } from '@app/shared/telegram/telegram.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: WinstonLogger('Nest Library'),
	});
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	const configService = app.get<ConfigService>(ConfigService);
	const telegramService = app.get<LibTelegramService>(LibTelegramService);
	mongoose.set('debug', true);
	await app.listen(configService.get<number>('CACHE_PORT'), async () => {
		Logger.log(`Server is running on ${await app.getUrl()}`),
			await telegramService.sendMessage(
				`🔥[DNI Service] is running on ${await app.getUrl()}`,
			);
	});
}
bootstrap();
