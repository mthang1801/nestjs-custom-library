export interface RedisConnectionOptions {
	host: string;
	port: string | number;
	username?: string;
	password?: string;
	createRedisConnection?():
		| Promise<RedisConnectionOptions>
		| RedisConnectionOptions;
}
