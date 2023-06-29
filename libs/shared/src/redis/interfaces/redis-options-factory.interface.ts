import { RedisConnectionOptions } from './redis-connection-options.interface';

export interface RedisOptionFactory {
	createRedisConnection():
		| Promise<RedisConnectionOptions>
		| RedisConnectionOptions;
}
