import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	TelegramDocument,
	TelegramMessage,
	TelegramService,
} from 'nestjs-telegram';
import { UtilService } from '../utils/util.service';
@Injectable()
export class LibTelegramService {
	chatId: string;
	constructor(
		private readonly configService: ConfigService,
		private readonly telegramService: TelegramService,
		private readonly utilService: UtilService,
	) {
		this.chatId = this.configService.get<string>('TELEGRAM_GROUP_ID');
	}

	canNotify(): boolean {
		return this.utilService.valueToBoolean(
			this.configService.get<boolean>('TELEGRAM_ENALBE_NOTI'),
		);
	}

	async sendMessage(message: string): Promise<TelegramMessage> {
		if (!this.canNotify()) return;
		return this.telegramService
			.sendMessage({
				chat_id: this.chatId,
				text: message,
			})
			.toPromise();
	}

	async sendDocument(document: Buffer | string): Promise<TelegramMessage> {
		if (!this.canNotify()) return;
		return this.telegramService
			.sendDocument({ chat_id: this.chatId, document })
			.toPromise();
	}
}
