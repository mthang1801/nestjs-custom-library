import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { CONNECTION_NAME } from './constants/connection-name';
import { MongooseDynamicModuleForFeatureOptions } from './interfaces/mongoose-dynamic-module-options.interface';

@Module({})
export class MongooseDynamicModule {
	static registerAsync(): DynamicModule {
		return {
			module: MongooseDynamicModule,
			imports: Object.values(CONNECTION_NAME).map((connectionName) =>
				this.MongooseForRootAsyncFactory(connectionName),
			),
			exports: [MongooseModule],
		};
	}

	private static MongooseForRootAsyncFactory(connectionName: CONNECTION_NAME) {
		return MongooseModule.forRootAsync({
			imports: [ConfigModule.forRoot({ isGlobal: true })],
			connectionName,
			useFactory: (
				configService: ConfigService,
			): MongooseModuleFactoryOptions => {
				return {
					uri: configService.get<string>(connectionName),
					dbName: configService.get<string>('MONGO_DATABASE'),
					// useUnifiedTopology: true,
					// maxPoolSize: Number(configService.get('MONGO_MAX_POOL_SIZE')),
					// serverSelectionTimeoutMS: 60000,
					// connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
					// socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
					// family: 4, // Use IPv4, skip trying IPv6
					// retryAttempts: 5,
				};
			},
			inject: [ConfigService],
		});
	}

	static forFeature({
		name,
		schema,
	}: MongooseDynamicModuleForFeatureOptions): DynamicModule {
		return {
			module: MongooseDynamicModule,
			imports: Object.values(CONNECTION_NAME).map((connectionName) =>
				this.forFeatureFactory({ name, schema, connectionName }),
			),
			exports: [MongooseModule],
		};
	}

	private static forFeatureFactory({
		name,
		schema,
		connectionName,
	}: MongooseDynamicModuleForFeatureOptions) {
		return MongooseModule.forFeature(
			[
				{
					name,
					schema,
				},
			],
			connectionName,
		);
	}
}
