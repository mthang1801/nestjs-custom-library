import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

@Module({
	imports: [
		I18nModule.forRootAsync({
			useFactory: (configService: ConfigService) => {
				return {
					fallbackLanguage:
						configService.get<string>('DEFAULT_LANGUAGE') || 'vi',
					loaderOptions: {
						path: join(process.cwd(), 'libs/shared/src/i18n/translates/'),
						watch: true,
					},
				};
			},
			resolvers: [
				{ use: QueryResolver, options: ['lang'] },
				AcceptLanguageResolver,
			],
			inject: [ConfigService],
		}),
	],
})
export class LibI18nModule {}
