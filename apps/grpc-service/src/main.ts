import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configServce = app.get<ConfigService>(ConfigService);
	await app.listen(configServce.get<string>('GRPC_PORT'), async () =>
		Logger.log(
			`Server is running on ${await app.getUrl()}`,
			'APPLICATION READY',
		),
	);
}
bootstrap();
