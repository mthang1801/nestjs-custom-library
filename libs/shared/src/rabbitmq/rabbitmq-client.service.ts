import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ClientProxyFactory,
	RmqContext,
	RmqOptions,
	RmqRecordBuilder,
	Transport,
} from '@nestjs/microservices';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { Observable, fromEvent, lastValueFrom, mapTo, merge, of } from 'rxjs';
import { RmqClientOptions } from './types/rabbitmq-client-options.type';
@Injectable()
export class RMQClientService {
	constructor(
		readonly configService: ConfigService,
		readonly amqpConnection?: AmqpConnection,
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
				prefetchCount: 2,
				isGlobalPrefetchCount: true,
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
				...properties,
				noAck: !!!properties.isAck,
			},
		};
	}

	createClient(properties: Pick<RmqClientOptions, 'queue' | 'urls'>) {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: properties.urls,
				queue: properties.queue,
				queueOptions: { durable: true },
				socketOptions: { noDelay: true },
			},
		});
	}

	crerateBuilder(payload: any, options?: RmqClientOptions) {
		return new RmqRecordBuilder()
			.setOptions({
				...options,
				headers: { ['x-delay']: '10000', ...options?.headers },
			})
			.setData(payload)
			.build();
	}

	public getUrl() {
		const [host, port, username, password, vHost] = [
			'RMQ_HOST',
			'RMQ_PORT',
			'RMQ_USERNAME',
			'RMQ_PASSWORD',
			'RMQ_VHOST',
		].map((item: string) => this.configService.get<string>(item));

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
