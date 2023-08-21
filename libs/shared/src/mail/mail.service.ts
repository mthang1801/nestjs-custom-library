import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { MailDataRequired } from '@sendgrid/mail';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MailService {
	constructor(
		@InjectSendGrid() private readonly sendGridService: SendGridService,
		private readonly i18n: I18nService,
		private readonly configService: ConfigService,
	) {}

	mailTemplate(properties: Partial<MailDataRequired>): MailDataRequired {
		return {
			...properties,
			from: this.configService.get<string>('SEND_GRID_EMAIL'),
		} as MailDataRequired;
	}

	async send(template: MailDataRequired, isMultiple = false) {
		return await this.sendGridService.send(template, isMultiple);
	}
}
