import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from 'nestjs-telegram';

@Injectable()
export class AppService {
	constructor(
		private readonly telegramService: TelegramService,
		private readonly configService: ConfigService,
	) {}

	async test() {
		try {
			this.telegramService
				.sendMessage({
					chat_id: this.configService.get<string>('TELEGRAM_GROUP_ID'),
					text: `server is running on ${this.configService.get<string>(
						'CLOUD_PORT',
					)}`,
				})
				.toPromise();
		} catch (error) {
			console.log(error.message);
		}
	}
}
