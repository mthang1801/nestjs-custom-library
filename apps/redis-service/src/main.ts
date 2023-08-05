import { WinstonLogger } from '@app/shared/logger/winston.logger';
import { NestFactory } from '@nestjs/core';
import { RedisServiceModule } from './redis-service.module';

async function bootstrap() {
	const app = await NestFactory.create(RedisServiceModule, {
		logger: WinstonLogger('REDIS SERVICE'),
	});
	await app.listen(3000);
}
bootstrap();
