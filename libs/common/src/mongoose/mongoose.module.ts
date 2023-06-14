import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { CONNECTION_NAME } from './constants/connection-name';
import { MongooseDynamicModuleForFeatureOptions } from './interfaces/mongoose-dynamic-module-options.interface';

@Module({})
export class MongooseDynamicModule {
	static registerAsync(
		connectionName = CONNECTION_NAME.PRIMARY,
	): DynamicModule {
		return {
			module: MongooseDynamicModule,
			imports: [
				MongooseModule.forRootAsync({
					imports: [ConfigModule.forRoot({ isGlobal: true })],
					connectionName,
					useFactory: (
						configService: ConfigService,
					): MongooseModuleFactoryOptions => {
						return {
							uri:
								connectionName === CONNECTION_NAME.PRIMARY
									? configService.get<string>('MONGO_URI_PRIMARY')
									: configService.get<string>('MONGO_URI_SECONDARY'),
							useUnifiedTopology: true,
							maxPoolSize: Number(configService.get('MONGO_MAX_POOL_SIZE')),
							serverSelectionTimeoutMS: 60000,
							connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
							socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
							family: 4, // Use IPv4, skip trying IPv6
							retryAttempts: 5,
						};
					},
					inject: [ConfigService],
				}),
			],
			exports: [MongooseModule],
		};
	}

	static forFeature({
		name,
		schema,
		connectionName = CONNECTION_NAME.PRIMARY,
	}: MongooseDynamicModuleForFeatureOptions): DynamicModule {
		return {
			module: MongooseDynamicModule,
			imports: [
				MongooseModule.forFeature(
					[
						{
							name,
							schema,
						},
					],
					connectionName,
				),
			],
			exports: [MongooseModule],
		};
	}
}
