import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramMessage, TelegramService } from 'nestjs-telegram';
@Injectable()
export class LibTelegramService {
	chatId: string;
	constructor(
		private readonly configService: ConfigService,
		private readonly telegramService: TelegramService,
	) {
		this.chatId = this.configService.get<string>('TELEGRAM_GROUP_ID');
	}

	async sendMessage(message: string): Promise<TelegramMessage> {
		return this.telegramService
			.sendMessage({
				chat_id: this.chatId,
				text: message,
			})
			.toPromise();
	}

	async sendDocument(document: Buffer | string) {
		return this.telegramService
			.sendDocument({ chat_id: this.chatId, document })
			.toPromise();
	}
}
