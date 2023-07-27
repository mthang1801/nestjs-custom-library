import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { Observable, fromEvent, lastValueFrom, mapTo, merge, of } from 'rxjs';
import { RmqClientOptions } from './types/rabbitmq-client-options.type';
@Injectable()
export class RabbitMQClientService {
	constructor(
		private readonly configService: ConfigService,
		private readonly amqpConnection: AmqpConnection,
	) {}

	/**
	 * Apply for old version
	 * @param {string} name
	 * @param {boolean} noAck
	 * @returns
	 */
	getOptions(name: string, noAck = true): RmqOptions {
		return {
			transport: Transport.RMQ,
			options: {
				urls: [this.getUrl()],
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

	/**
	 * Apply for new version
	 * @param {RmqClientOptions} properties
	 */
	getConsumer(properties: RmqClientOptions): RmqOptions {
		return {
			transport: Transport.RMQ,
			options: {
				urls: [this.getUrl()],
				prefetchCount: 10,
				isGlobalPrefetchCount: true,
				queueOptions: {
					durable: true,
				},
				...properties,
				noAck: properties.isAck ? false : true,
			},
		};
	}

	private getUrl() {
		const { username, password, host, port, vHost } =
			this.configService.get('rabbitmq');
		return `amqp://${username}:${password}@${host}:${port}${vHost || '/'}`;
	}

	async statusCheck(): Promise<HealthIndicatorResult> {
		const isHealthy = await lastValueFrom(this.watch());
		console.log('statusCheckstatusCheckstatusCheckstatusCheck');
		if (isHealthy) {
			return {
				rabbitmq: { status: 'up' },
			};
		}

		return {
			rabbitmq: { status: 'down' },
		};
	}

	ack(context: RmqContext) {
		const channel = context.getChannelRef();
		const message = context.getMessage();
		channel.ack(message);
	}

	check(): boolean {
		return this.amqpConnection.managedConnection.isConnected();
	}

	watch(): Observable<boolean> {
		console.log('statusCheckstatusCheckstatusCheckstatusCheckWatch');
		return merge(
			of(this.check()),
			fromEvent(this.amqpConnection.managedConnection, 'closed').pipe(
				mapTo(false),
			),
			fromEvent(this.amqpConnection.managedConnection, 'error').pipe(
				mapTo(false),
			),
			fromEvent(this.amqpConnection.managedConnection, 'connect').pipe(
				mapTo(true),
			),
		);
	}
}
