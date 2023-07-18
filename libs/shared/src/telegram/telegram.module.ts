import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramModule } from 'nestjs-telegram';
import { LibTelegramService } from './telegram.service';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
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
