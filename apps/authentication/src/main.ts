import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { AuthenticationModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		AuthenticationModule,
	);
	mongoose.set('debug', true);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	const configService = app.get<ConfigService>(ConfigService);
	await app.listen(configService.get<number>('AUTH_PORT'), async () =>
		Logger.log(
			`Server is running on ${await app.getUrl()}`,
			'APPLICATION READY',
		),
	);
}
bootstrap();
