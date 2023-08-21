import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import * as Joi from 'joi';
import { LibI18nModule } from '../i18n';
import { MailService } from './mail.service';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			expandVariables: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			validationSchema: Joi.object({
				SEND_GRID_API_KEY: Joi.string().required(),
			}),
		}),
		LibI18nModule,
		SendGridModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				apiKey: configService.get<string>('SEND_GRID_API_KEY'),
			}),
			inject: [ConfigService],
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class LibMailModule {}
