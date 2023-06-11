import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
@Injectable()
export class RabbitMQService {
	constructor(private readonly configService: ConfigService) {}

	getOptions(name: string, noAck = true): RmqOptions {
		return {
			transport: Transport.RMQ,
			options: {
				urls: [
					`amqp://${this.configService.get<string>(
						'rabbitmq.username',
					)}:${this.configService.get<string>(
						'rabbitmq.password',
					)}@${this.configService.get<string>(
						'rabbitmq.host',
					)}:${this.configService.get<string>('rabbitmq.port')}${
						this.configService.get<string>('rabbitmq.vHost') || '/'
					}`,
				],
				queue: name,
				prefetchCount: 1,
				isGlobalPrefetchCount: true,
				noAck,
				queueOptions: {
					durable: true,
				},
			},
		};
	}

	ack(context: RmqContext) {
		const channel = context.getChannelRef();
		const message = context.getMessage();
		channel.ack(message);
	}
}
