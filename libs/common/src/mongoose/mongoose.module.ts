import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { CONNECTION_NAME } from './constants/connection-name';
import { MongooseDynamicModuleForFeatureOptions } from './interfaces/mongoose-dynamic-module-options.interface';

@Module({})
export class MongooseDynamicModule {
	static forRootAsync(): DynamicModule {
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
			connectionName,
			useFactory: (
				configService: ConfigService,
			): MongooseModuleFactoryOptions => {
				return {
					uri: configService.get<string>(connectionName),
					dbName: configService.get<string>('MONGO_DATABASE'),
				};
			},
			inject: [ConfigService],
		});
	}

	static forFeatureAsync({
		name,
		schema,
		useFactory,
		inject,
	}: MongooseDynamicModuleForFeatureOptions): DynamicModule {
		return {
			module: MongooseDynamicModule,
			imports: Object.values(CONNECTION_NAME).map((connectionName) =>
				this.forFeatureFactory({
					name,
					schema,
					useFactory,
					inject,
					connectionName,
				}),
			),
			exports: [MongooseModule],
		};
	}

	private static forFeatureFactory({
		name,
		connectionName,
		useFactory,
		inject,
	}: MongooseDynamicModuleForFeatureOptions) {
		return MongooseModule.forFeatureAsync(
			[
				{
					name,
					inject,
					useFactory,
				},
			],
			connectionName,
		);
	}
}
