import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as Joi from 'joi';
import { LibHttpModule } from '../http/http.module';
import { LibLogger } from '../logger/logger.module';
import { LibTelegramModule } from '../telegram/telegram.module';
import { LibUtilModule } from '../utils/util.module';

@Global()
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
				NODE_ENV: Joi.valid('development', 'production').required(),
				TELEGRAM_ENALBE_NOTI: Joi.boolean().required(),
			}),
			expandVariables: true,
		}),
		LibTelegramModule,
		LibHttpModule,
		LibUtilModule,
		EventEmitterModule.forRoot(),
		LibLogger,
	],
})
export class LibCoreModule {}
