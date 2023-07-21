import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramModule } from 'nestjs-telegram';
import { LibTelegramService } from './telegram.service';
import * as Joi from 'joi';
import { LibUtilModule } from '../utils/util.module';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			validationSchema: Joi.object({
				TELEGRAM_ENALBE_NOTI: Joi.boolean().required(),
				TELEGRAM_BOT_ID: Joi.string().required(),
				TELEGRAM_GROUP_ID: Joi.string().required(),
			}),
		}),
		LibUtilModule,
		TelegramModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					botKey: configService.get<string>('TELEGRAM_BOT_ID'),
				};
			},
		}),
	],
	exports: [TelegramModule, LibTelegramService],
	providers: [TelegramModule, LibTelegramService],
})
export class LibTelegramModule {}
