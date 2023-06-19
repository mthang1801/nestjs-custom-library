import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { CONNECTION_NAME } from './constants/connection-name';
import { MongooseDynamicModuleForFeatureOptions } from './interfaces/mongoose-dynamic-module-options.interface';

@Module({})
export class MongooseDynamicModule {
	static forRootAsync(): DynamicModule {
		return {
			module: MongooseDynamicModule,
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					validationSchema: Joi.object({
						NODE_ENV: Joi.string()
							.valid('development', 'production', 'test', 'provision')
							.default('development'),
						PORT: Joi.number().port().required(),
						MONGO_URI_PRIMARY: Joi.string().required(),
						MONGO_URI_SECONDARY: Joi.string().optional(),
					}),
					validationOptions: {
						abortEarly: false,
					},
					cache: true,
					expandVariables: true,
					envFilePath:
						process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
				}),
				...Object.values(CONNECTION_NAME).map((connectionName) =>
					this.MongooseForRootAsyncFactory(connectionName),
				),
			],
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
		imports,
	}: MongooseDynamicModuleForFeatureOptions): DynamicModule {
		return {
			module: MongooseDynamicModule,
			imports: Object.values(CONNECTION_NAME).map((connectionName) =>
				this.forFeatureAsyncFactory({
					name,
					schema,
					useFactory,
					inject,
					connectionName,
					imports,
				}),
			),
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
				this.forFeatureFactory({
					name,
					schema,
					connectionName,
				}),
			],
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

	private static forFeatureAsyncFactory({
		name,
		connectionName,
		schema,
		useFactory,
		inject,
		imports,
	}: MongooseDynamicModuleForFeatureOptions) {
		return MongooseModule.forFeatureAsync(
			[
				{
					name,
					inject,
					useFactory: useFactory ? useFactory : () => schema,
					imports,
				},
			],
			connectionName,
		);
	}
}
