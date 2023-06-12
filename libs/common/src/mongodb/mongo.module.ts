import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CONFIG_NAME } from '../config/config.name';
import mongodbConfig from '../config/mongodb.config';
import type { MongodbConfig } from '../types';
import { MongoDBModuleOptions } from './interface/mongodb-module-options.interface';

@Module({})
export class MongoDBModule {
	static forRootAsync({ connection }: MongoDBModuleOptions): DynamicModule {
		return {
			module: MongoDBModule,
			imports: [
				ConfigModule.forRoot({ isGlobal: true, load: [mongodbConfig] }),
				MongooseModule.forRootAsync({
					useFactory: (configService: ConfigService) => ({
						uri: this.getUri(
							configService.get<MongodbConfig>(CONFIG_NAME.mongodb),
						),
						dbName: configService.get<MongodbConfig>(
							`${CONFIG_NAME.mongodb}.database`,
						),
						retryAttempts: 3,
						retryDelay: 30000,
						connectionName: connection,
					}),
					inject: [ConfigService],
				}),
			],
			exports: [MongoDBModule],
		};
	}

	static getUri(configParams: MongodbConfig): string {
		const { host, port, username, password } = configParams;
		if (username && password) {
			return `mongdb://${username}:${password}@${host}:${port}`;
		}
		return `mongdb://${host}:${port}`;
	}
}
