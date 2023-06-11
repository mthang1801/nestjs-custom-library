import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import rabbitmqConfig from '../config/rabbitmq.config';
import { RabbitMQService } from './rabbitmq.service';
import { RMQDynamicModuleOptions } from './types/rabbitmq-dynamic-module-options.type';
@Module({})
export class RabbitMQModule {
	static registerAsync({ name }: RMQDynamicModuleOptions): DynamicModule {
		return {
			module: RabbitMQModule,
			imports: [
				ClientsModule.registerAsync([
					{
						imports: [
							ConfigModule.forRoot({
								isGlobal: true,
								envFilePath: '.env',
								load: [rabbitmqConfig],
							}),
						],
						name: name,
						useFactory: (configService: ConfigService) => ({
							transport: Transport.RMQ,
							options: {
								urls: [
									`amqp://${configService.get<string>(
										'rabbitmq.username',
									)}:${configService.get<string>(
										'rabbitmq.password',
									)}@${configService.get<string>(
										'rabbitmq.host',
									)}:${configService.get<string>('rabbitmq.port')}${
										configService.get<string>('rabbitmq.vHost') || '/'
									}`,
								],
								queue: name,
							},
						}),
						inject: [ConfigService],
					},
				]),
			],
			providers: [RabbitMQService],
			exports: [RabbitMQService, ClientsModule],
		};
	}
}
