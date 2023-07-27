import { RabbitMQModule as GoLevelUpRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import rabbitmqConfig from '../config/rabbitmq.config';
import { RabbitMQClientService } from './rabbitmq-client.service';
import { RMQDynamicModuleOptions } from './types/rabbitmq-dynamic-module-options.type';
@Module({})
export class RabbitMQModule {
	static registerAsync({ name }: RMQDynamicModuleOptions): DynamicModule {
		return {
			module: RabbitMQModule,
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					envFilePath: '.env',
					load: [rabbitmqConfig],
				}),
				GoLevelUpRabbitMQModule.forRootAsync(GoLevelUpRabbitMQModule, {
					useFactory: (configService: ConfigService) => ({
						exchanges: [
							{
								name,
								type: 'topic',
								options: {
									durable: true,
								},
							},
						],
						uri: this.getUrl(configService),
						connectionInitOptions: { wait: true, reject: true, timeout: 30000 },
					}),
					inject: [ConfigService],
				}),
				ClientsModule.registerAsync([
					{
						name: name,
						useFactory: (configService: ConfigService) => ({
							transport: Transport.RMQ,
							options: {
								urls: [this.getUrl(configService)],
								queue: name,
								queueOptions: {
									durable: true,
								},
								socketOptions: {
									noDelay: true,
									retryAttempts: 5,
									retryDelay: 10000,
									heartbeatIntervalInSeconds: 60,
									reconnectTimeInSeconds: 5,
								},
							},
						}),
						inject: [ConfigService],
					},
				]),
			],
			providers: [RabbitMQClientService],
			exports: [RabbitMQClientService, ClientsModule, RabbitMQModule],
		};
	}

	private static getUrl(configService: ConfigService) {
		const { username, password, host, port, vHost } =
			configService.get('rabbitmq');
		return `amqp://${username}:${password}@${host}:${port}${vHost || '/'}`;
	}
}
