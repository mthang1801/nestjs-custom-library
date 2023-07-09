import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			expandVariables: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			validationSchema: Joi.object({
				EMAIL_HOST: Joi.string().required(),
				EMAIL_PORT: Joi.number().required(),
				EMAIL_USER: Joi.string().required(),
				EMAIL_PASS: Joi.string().required(),
			}),
		}),
		MailerModule.forRootAsync({
			useFactory: (configService: ConfigService) => {
				return {
					transport: {
						host: configService.get('EMAIL_HOST'),
						secure: true,
						port: configService.get('EMAIL_PORT'),
						auth: {
							user: configService.get('EMAIL_USER'),
							pass: configService.get('EMAIL_PASS'),
						},
						tls: { rejectUnauthorized: false },
						debug: true,
					},
					defaults: {
						from: configService.get('EMAIL_USER'),
					},
					template: {
						dir: join(process.cwd(), 'libs/shared/src/mail/templates'),
						adapter: new HandlebarsAdapter(),
						options: {
							strict: false,
						},
					},
				};
			},

			inject: [ConfigService],
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
