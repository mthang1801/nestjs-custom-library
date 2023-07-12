import { LibTelegramModule } from '@app/shared/telegram/telegram.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		ScheduleModule.forRoot(),
		LibTelegramModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
