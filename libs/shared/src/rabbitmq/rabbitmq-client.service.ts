import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ClientProxyFactory,
	RmqContext,
	RmqOptions,
	RmqRecordBuilder,
	Transport,
} from '@nestjs/microservices';
import { HealthIndicatorResult } from '@nestjs/terminus';
import {
	Observable,
	fromEvent,
	lastValueFrom,
	mapTo,
	merge,
	of,
	timeout,
} from 'rxjs';
import { ENUM_EVENT_PATTERN, ENUM_QUEUES } from '../constants';
import { RmqClientOptions } from './types/rabbitmq-client-options.type';
@Injectable()
export class RMQClientService {
	logger = new Logger(RMQClientService.name);
	constructor(
		readonly configService: ConfigService,
		readonly amqpConnection?: AmqpConnection,
	) {}

	/**
	 * Apply for new version
	 * @param {RmqClientOptions} properties
	 */
	getConsumer(properties: RmqClientOptions): RmqOptions {
		return {
			transport: Transport.RMQ,
			options: {
				urls: [this.configService.get<string>('RMQ_URI')],
				prefetchCount: 10,
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

	createClient(properties: RmqClientOptions) {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [this.configService.get<string>('RMQ_URI')],
				queue: properties.queue,
				queueOptions: { durable: true },
				socketOptions: { noDelay: true },
			},
			...properties,
		});
	}

	/**
	 * Publish data to queue
	 * @param queue
	 * @param pattern
	 * @param payload
	 */
	publishDataToQueue<T extends any>(
		queue: keyof typeof ENUM_QUEUES,
		pattern: keyof typeof ENUM_EVENT_PATTERN,
		payload: T,
	) {
		this.logger.log('*********** publishDataToQueue ***********');
		const client = this.createClient({ queue });
		client.emit<T, any>(pattern, payload);
	}

	/**
	 * Pub/ sub data to queue
	 * @param queue
	 * @param pattern
	 * @param payload
	 */
	async pubSubDataToQueue<T extends any>(
		queue: keyof typeof ENUM_QUEUES,
		pattern: keyof typeof ENUM_EVENT_PATTERN,
		payload: T,
	): Promise<T> {
		this.logger.log('*********** pubSubDataToQueue ***********');
		const client = this.createClient({ queue });
		return lastValueFrom(client.send<T>(pattern, payload).pipe(timeout(60000)));
	}

	createBuilder(payload: any, options?: RmqClientOptions) {
		return new RmqRecordBuilder()
			.setOptions({
				...options,
				headers: { ['x-delay']: '10000', ...options?.headers },
			})
			.setData(payload)
			.build();
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
