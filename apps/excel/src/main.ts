import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { TelegramService } from 'nestjs-telegram';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const telegramService = app.get<TelegramService>(TelegramService);
	const enableTelegramNoti = configService.get<boolean>('TELEGRAM_ENALBE_NOTI');

	await app.listen(configService.get<number>('EXCEL_PORT'), async () => {
		Logger.log(`Server is running on ${await app.getUrl()}`),
			enableTelegramNoti &&
				(await telegramService
					.sendMessage({
						chat_id: configService.get<string>('TELEGRAM_GROUP_ID'),
						text: `🔥[DNI Excel Service] is running on ${await app.getUrl()}`,
					})
					.toPromise());
	});
}
bootstrap();
