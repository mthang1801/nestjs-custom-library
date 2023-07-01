import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramModule } from 'nestjs-telegram';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		TelegramModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				Logger.log(`TELEGRAM BOT`);
				return {
					botKey: configService.get<string>('TELEGRAM_BOT_ID'),
				};
			},
		}),
	],
	exports: [TelegramModule],
})
export class TelegramDynamicModule {}
