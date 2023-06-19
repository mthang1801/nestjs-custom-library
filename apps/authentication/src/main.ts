import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(5006, async () =>
		Logger.log(
			`Server is running on ${await app.getUrl()}`,
			'APPLICATION READY',
		),
	);
}
bootstrap();
