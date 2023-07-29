import { RabbitMQModule as GoLevelUpRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import rabbitmqConfig from '../config/rabbitmq.config';
import { RMQClientService } from './rabbitmq-client.service';
import { RMQDynamicModuleOptions } from './types/rabbitmq-dynamic-module-options.type';
@Module({
	providers: [RMQClientService, ClientsModule],
	exports: [RMQClientService, ClientsModule],
})
export class LibRabbitMQModule {
	static registerAsync({ name }: RMQDynamicModuleOptions): DynamicModule {
		return {
			module: LibRabbitMQModule,
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
						useFactory: (configService: ConfigService) => {
							return {
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
										retryDelay: 10,
										heartbeatIntervalInSeconds: 60,
										reconnectTimeInSeconds: 5,
									},
								},
							};
						},

						inject: [ConfigService],
					},
				]),
			],
			providers: [RMQClientService],
			exports: [RMQClientService, ClientsModule, ClientsModule],
		};
	}

	static getUrl(configService: ConfigService) {
		const [host, port, username, password, vHost] = [
			'RMQ_HOST',
			'RMQ_PORT',
			'RMQ_USERNAME',
			'RMQ_PASSWORD',
			'RMQ_VHOST',
		].map((item: string) => configService.get<string>(item));

		return `amqp://${username}:${password}@${host}:${port}${vHost || '/'}`;
	}
}
