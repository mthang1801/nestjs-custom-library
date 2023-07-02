import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TelegramDynamicModule } from '../telegram/telegram.module';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			validationSchema: Joi.object({
				AUTH_PORT: Joi.number().required(),
				JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
				JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
				JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
				JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
			}),
			expandVariables: true,
		}),
		TelegramDynamicModule,
	],
})
export class CoreModule {}
