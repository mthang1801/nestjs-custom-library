import { registerAs } from '@nestjs/config';
import { MongodbConfig } from '../types/mongodb-config.type';
import { CONFIG_NAME } from './config.name';

const { env } = process;

export default registerAs(
	CONFIG_NAME.mongodb,
	(): MongodbConfig => ({
		host: env.MONGO_HOST,
		port: env.MONGO_PORT,
		username: env.MONGO_USERNAME,
		password: env.MONGO_PASSWORD,
		database: env.MONGO_DATABASE,
	}),
);
