import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.useStaticAssets(join(__dirname, '../../..', 'public'));
	const configService = app.get<ConfigService>(ConfigService);
	await app.listen(configService.get<number>('SSE_PORT'), async () =>
		Logger.log(`Server is running on ${await app.getUrl()}`),
	);
}
bootstrap();
