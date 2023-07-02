import { RedisIoAdapter } from '@app/shared/redis/redis-io-adapter';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WebSocketsModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(WebSocketsModule);
	const configService = app.get<ConfigService>(ConfigService);
	const redisIoAdapter = new RedisIoAdapter(app, configService);
	await redisIoAdapter.connectToRedis();
	app.useWebSocketAdapter(redisIoAdapter);

	await app.listen(configService.get<number>('WEBSOCKET_PORT'), async () => {
		Logger.log(`Server is running on ${await app.getUrl()}`);
	});
}
bootstrap();
