import { SetupSwagger } from '@app/common/swagger/setup';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

(async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.setGlobalPrefix('api');
	app.enableVersioning({
		type: VersioningType.URI,
		prefix: 'v',
		defaultVersion: ['1', '2'],
	});

	const configServce = app.get<ConfigService>(ConfigService);

	SetupSwagger(app, { theme: 'FLATTOP', title: 'NestJS API', icon: 'NT_OMS' });

	await app.listen(configServce.get<string>('SWAGGER_PORT'), async () =>
		Logger.log(
			`Server is running on ${await app.getUrl()}`,
			'APPLICATION READY',
		),
	);
})();
