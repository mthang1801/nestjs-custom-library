import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { CONNECTION_NAME } from './constants/connection-name';
import { LibMongoModuleForFeatureOptions } from './interfaces/mongoose-dynamic-module-options.interface';
import { LibMongoService } from './mongodb.service';
import * as promiseRetry from 'promise-retry';
@Module({
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
				MONGO_DATABASE: Joi.string().required(),
			}),
			validationOptions: {
				abortEarly: false,
			},
			cache: true,
			expandVariables: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
	],
	providers: [LibMongoService],
	exports: [LibMongoService],
})
export class LibMongoModule {
	static forRootAsync(): DynamicModule {
		return {
			module: LibMongoModule,
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					validationSchema: Joi.object({
						NODE_ENV: Joi.string()
							.valid('development', 'production', 'test', 'provision')
							.default('development'),
						MONGO_DATABASE: Joi.string().required(),
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
					maxPoolSize: 1000,
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
	}: LibMongoModuleForFeatureOptions): DynamicModule {
		return {
			module: LibMongoModule,
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
	}: LibMongoModuleForFeatureOptions): DynamicModule {
		return {
			module: LibMongoModule,
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
	}: LibMongoModuleForFeatureOptions) {
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
	}: LibMongoModuleForFeatureOptions) {
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
