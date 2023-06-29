import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';
import { REDIS_CONNECTION_OPTIONS } from './constants/constants';
import { RedisConnectionOptions } from './interfaces';

@Injectable()
export class RedisService {
	protected readonly logger = new Logger(RedisService.name);
	protected redisClient: RedisClientType = null;
	constructor(
		@Inject(REDIS_CONNECTION_OPTIONS)
		protected readonly redisConnectionOptions: RedisConnectionOptions,
	) {}

	getUrl() {
		const { host, port, username, password } = this.redisConnectionOptions;
		if (username && password)
			return `redis://${username}:${password}@${host}:${port}`;
		return `redis://${host}:${port}`;
	}

	public async connect() {
		this.redisClient ??
			(this.redisClient = await createClient({
				url: this.getUrl(),
				username: this.redisConnectionOptions.username || undefined,
				password: this.redisConnectionOptions.password || undefined,
			}));
		await this.redisClient.connect();
		this.logger.log(`Redis Server has connected to ${this.getUrl()}`);
	}

	protected async disconnect() {
		if (this.redisClient) {
			await this.redisClient.disconnect();
			this.logger.log(`Redis server has disconnected from ${this.getUrl()}`);
		}
	}

	async ping(message?: string): Promise<string> {
		return this.redisClient.ping(message);
	}
}
