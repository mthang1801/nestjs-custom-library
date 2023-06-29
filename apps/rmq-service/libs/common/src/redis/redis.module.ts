import { DynamicModule, Module, Provider } from '@nestjs/common';
import { REDIS, REDIS_CONNECTION_OPTIONS } from './constants/constants';
import { RedisModuleAsyncOptions, RedisOptionFactory } from './interfaces';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
	static registerAsync(
		connectionOptions: RedisModuleAsyncOptions,
	): DynamicModule {
		return {
			module: RedisModule,
			imports: connectionOptions.imports || [],
			providers: [
				RedisService,
				connectionOptions.useClass || undefined,
				connectionOptions.useExisting || undefined,
				this.createConnectionProvider(connectionOptions),
				this.createConnectFactory(),
			].filter(Boolean),
			exports: [RedisService],
		};
	}

	static createConnectionProvider(
		connectionOptions: RedisModuleAsyncOptions,
	): Provider {
		if (connectionOptions.useFactory) {
			return {
				provide: REDIS_CONNECTION_OPTIONS,
				useFactory: connectionOptions.useFactory,
				inject: connectionOptions.inject || [],
			};
		}

		return {
			provide: REDIS_CONNECTION_OPTIONS,
			useFactory: async (optionFactory: RedisOptionFactory) =>
				optionFactory.createRedisConnection(),
			inject:
				[connectionOptions.useClass || connectionOptions.useExisting] || [],
		};
	}

	static createConnectFactory(): Provider {
		return {
			provide: REDIS,
			useFactory: async (redisService: RedisService) =>
				await redisService.connect(),
			inject: [RedisService],
		};
	}
}
