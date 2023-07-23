import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisConfig from '../config/redis.config';
import { LibUtilModule } from '../utils/util.module';
import { REDIS, REDIS_CONNECTION_OPTIONS } from './constants/constants';
import { RedisModuleAsyncOptions, RedisOptionFactory } from './interfaces';
import { LibRedisService } from './redis.service';
import { LibRedisUtil } from './redis.utils';

@Module({
	imports: [LibUtilModule],
})
export class LibRedisModule {
	static registerAsync(
		connectionOptions: RedisModuleAsyncOptions,
	): DynamicModule {
		return {
			module: LibRedisModule,
			imports: connectionOptions.imports || [
				ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
			],
			providers: [
				LibRedisUtil,
				LibRedisService,
				connectionOptions.useClass || undefined,
				connectionOptions.useExisting || undefined,
				this.createConnectionProvider(connectionOptions),
				this.createConnectFactory(),
			].filter(Boolean),
			exports: [LibRedisService],
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
			useFactory: async (redisService: LibRedisService) =>
				await redisService.connect(),
			inject: [LibRedisService],
		};
	}
}
