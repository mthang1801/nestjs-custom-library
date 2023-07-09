import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
	@Get()
	async getHello(@I18n() i18n: I18nContext) {
		return await i18n.t('messages.login', { args: { timestamp: new Date() } });
	}
}
