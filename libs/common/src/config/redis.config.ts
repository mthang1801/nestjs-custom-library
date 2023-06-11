import { registerAs } from '@nestjs/config';
const { env } = process;

export type RedisConfig = {
	host: string;
	port: string | number;
	username?: string;
	password?: string;
};

export default registerAs('redis', () => ({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	username: env.REDIS_USERNAME,
	password: env.REDIS_PASSWORD,
}));
