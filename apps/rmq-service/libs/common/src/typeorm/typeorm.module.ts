import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { TypeORMDynamicModuleOptions } from './interfaces/typeorm-dynamic-module-options.interface';

@Module({})
export class TypeORMDynamicModule {
	static forRootAsync({
		logger = true,
	}: TypeORMDynamicModuleOptions): DynamicModule {
		return {
			module: TypeORMDynamicModule,
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					envFilePath:
						process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
					validationSchema: Joi.object({
						MYSQL_POOL_SIZE: Joi.number().required(),
						MYSQL_MASTER_HOST: Joi.string().required(),
						MYSQL_MASTER_PORT: Joi.number().required(),
						MYSQL_MASTER_USERNAME: Joi.string().required(),
						MYSQL_MASTER_PASSWORD: Joi.string().required(),
						MYSQL_SLAVE_HOST: Joi.string().required(),
						MYSQL_SLAVE_PORT: Joi.number().required(),
						MYSQL_SLAVE_USERNAME: Joi.string().required(),
						MYSQL_SLAVE_PASSWORD: Joi.string().required(),
						MYSQL_MASTER_DATABASE: Joi.string().required(),
						MYSQL_SLAVE_DATABASE: Joi.string().required(),
					}),
				}),
				TypeOrmModule.forRootAsync({
					useFactory: (configService: ConfigService): any => {
						console.log(configService.get<string>('MYSQL_MASTER_DATABASE'));
						return {
							type: 'mysql',
							logger,
							timezone: '+07:00',
							cache: true,
							retryDelay: 10000,
							retryAttempts: 5,
							autoLoadEntities: true,
							poolSize: configService.get<number>('MYSQL_POOL_SIZE'),
							replication: {
								master: {
									host: configService.get<string>('MYSQL_MASTER_HOST'),
									port: configService.get<number>('MYSQL_MASTER_PORT'),
									username: configService.get<string>('MYSQL_MASTER_USERNAME'),
									password: configService.get<string>('MYSQL_MASTER_PASSWORD'),
									database: configService.get<string>('MYSQL_MASTER_DATABASE'),
								},
								slaves: [
									{
										host: configService.get<string>('MYSQL_SLAVE_HOST'),
										port: configService.get<number>('MYSQL_SLAVE_PORT'),
										username: configService.get<string>('MYSQL_SLAVE_USERNAME'),
										password: configService.get<string>('MYSQL_SLAVE_PASSWORD'),
										database: configService.get<string>('MYSQL_SLAVE_DATABASE'),
									},
								],
							},
							entities: [],
							synchronize: true,
						};
					},
					inject: [ConfigService],
				}),
			],
			exports: [TypeOrmModule],
		};
	}
}
