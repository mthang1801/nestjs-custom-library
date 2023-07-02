import { registerAs } from '@nestjs/config';
import { CONFIG_NAME } from './config.name';
const { env } = process;

export type RedisConfig = {
	host: string;
	port: string | number;
	username?: string;
	password?: string;
};

export default registerAs(CONFIG_NAME.redis, () => ({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	username: env.REDIS_USERNAME || undefined,
	password: env.REDIS_PASSWORD || undefined,
}));
