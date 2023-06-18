import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	const configService = app.get<ConfigService>(ConfigService);
	mongoose.set('debug', true);
	await app.listen(configService.get<number>('PORT'), async () =>
		Logger.log(
			`Server is running on ${await app.getUrl()}`,
			'APPLICATION READY',
		),
	);
}
bootstrap();
