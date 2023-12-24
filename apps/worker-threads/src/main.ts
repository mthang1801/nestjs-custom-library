import { MorganLogger } from '@app/shared/logger/morgan.logger';
import { WinstonLogger } from '@app/shared/logger/winston.logger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { WorkerThreadsModule } from './worker-threads.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		WorkerThreadsModule,
		{
			logger: WinstonLogger('WORKER THREADc SERVICE'),
		},
	);
	app.use(MorganLogger());
	app.useStaticAssets(join(process.cwd(), 'public'));
	const configService = app.get<ConfigService>(ConfigService);
	await app.listen(configService.get<number>('WORKER_THREADS_PORT'), async () =>
		Logger.log(`Server is running on ${await app.getUrl()}`),
	);
	await app.init();
}
bootstrap();
