import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { WinstonLogger } from '@app/shared/logger/winston.logger';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: WinstonLogger('SSE SERVICE'),
	});
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.useStaticAssets(join(process.cwd(), 'public'));
	const configService = app.get<ConfigService>(ConfigService);
	await app.listen(configService.get<number>('SSE_PORT'), async () =>
		Logger.log(`Server is running on ${await app.getUrl()}`),
	);
}
bootstrap();
