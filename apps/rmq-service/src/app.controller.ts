import { ENUM_QUEUES } from '@app/shared';
import { COMMAND } from '@app/shared/constants/command';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RmqRecordBuilder,
  Transport,
} from '@nestjs/microservices';
import {
  Observable,
  delay,
  from,
  lastValueFrom,
  of,
  scan,
  timeout,
} from 'rxjs';
import { RmqServiceService } from './app.service';
@Controller()
export class RmqServiceController {
	client: ClientProxy;
	constructor(private readonly rmqServiceService: RmqServiceService) {
		this.client = ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: ['amqp://root:admin123@localhost:5672/'],
				queue: ENUM_QUEUES.TEST,
				queueOptions: { durable: true },
				socketOptions: { noDelay: true },
			},
		});
	}

	@Post()
	async call(@Body('numbers') payload: number[]) {
		const res = await lastValueFrom(
			this.client.send({ cmd: COMMAND.GET_SUM }, { numbers: payload }),
		);

		return {
			metadata: {
				currentPage: 1,
				pageSize: 10,
				total: 100,
			},
			result: res,
			items: [1, 2, 3, 4, 5],
			extra: ['a', 'b'],
		};
	}

	@Post('stream')
	stream(@Body('numbers') payload: number[]): Observable<number> {
		return this.client
			.send<number>({ cmd: COMMAND.SUM_STREAMING }, { numbers: payload })
			.pipe(
				scan((acc, ele) => acc + ele),
				delay(2000),
			);
	}

	@Post('streaming')
	streaming(@Body('numbers') payload: number[]) {
		const accumulators = [];

		return new Promise((resolve, reject) => {
			this.client
				.send<number>({ cmd: COMMAND.STREAMING }, { numbers: payload })
				.pipe(delay(3000), timeout(2000))
				.subscribe({
					next: (value) => {
						accumulators.push(value);
					},
					complete: () => {
						resolve(accumulators);
					},
				});
		}).then((res) => res);
	}

	@Post('concurrent')
	concurrent(@Body('numbers') payload: number[][]): Promise<boolean> {
		const send = async (tab: number[]) => {
			const expected = tab.reduce((a, b) => a + b);
			const result = await lastValueFrom(
				this.client.send<number>({ cmd: COMMAND.GET_SUM }, { numbers: tab }),
			);
			return expected === result;
		};

		return payload
			.map(async (tab) => send(tab))
			.reduce(async (a, b) => (await a) && b);
	}

	@Post('multi-urls')
	multiUrls(@Body('numbers') payload: number[]) {
		const clietnMultiUrls = ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [
					'amqp://root:admin123@localhost:5672/',
					'amqp://root:admin123@localhost:5672/',
				],
				queue: ENUM_QUEUES.TEST,
				queueOptions: { durable: true },
				socketOptions: { noDelay: true },
			},
		});

		return clietnMultiUrls.send<number>(
			{ cmd: COMMAND.MULTI_URLS },
			{ numbers: payload },
		);
	}

	@Post('record-builder-duplex')
	useRecordBuilderDuplex(@Body() data: Record<string, any>) {
		const record = new RmqRecordBuilder(data)
			.setOptions({
				headers: {
					['x-version']: '1.0.0',
					['x-api-key']: 'ABCDE',
				},
				priority: 2,
			})
			.build();

		return this.client.send({ cmd: COMMAND.BUILDER }, record);
	}

	@Post('broadcast')
	multicast(@Body('numbers') payload: number[]) {
		const multiClient = ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: ['amqp://root:admin123@localhost:5672/'],
				queue: ENUM_QUEUES.BROAD_CAST,
				queueOptions: { durable: true },
				socketOptions: { noDelay: true },
			},
		});

		const acc = [];

		return new Promise((resolve, reject) => {
			multiClient
				.send<any>({ cmd: COMMAND.BROADCAST }, { numbers: payload })
				.subscribe({
					next: (value) => {
						acc.push(value);
					},
					complete: () => resolve(acc),
				});
		}).then((res) => res);
	}

	@MessagePattern({ cmd: COMMAND.GET_SUM })
	sum(@Payload('numbers') payload: number[]) {
		return (payload || []).reduce((acc, ele) => acc + ele);
	}

	@MessagePattern({ cmd: COMMAND.SUM_STREAMING })
	sumStream(@Payload('numbers') payload: number[]): Observable<number> {
		return of(payload.reduce((acc, ele) => acc + ele));
	}

	@MessagePattern({ cmd: COMMAND.MULTI_URLS })
	handleMultiUrls(@Payload('numbers') payload: number[]) {
		return (payload || []).reduce((acc, ele) => acc + ele);
	}

	@MessagePattern({ cmd: COMMAND.STREAMING })
	handleStreaming(@Payload('numbers') payload: number[]): Observable<number> {
		return from(payload).pipe(scan((acc, ele) => acc + ele));
	}

	@MessagePattern({ cmd: COMMAND.BUILDER })
	handleRecordBuilder(@Payload() payload, @Ctx() ctx: RmqContext) {
		const originalMsg = ctx.getMessage();
		return {
			payload,
			headers: originalMsg.properties.headers,
			priority: originalMsg.properties.priority,
		};
	}

	@MessagePattern({ cmd: COMMAND.BROADCAST })
	replyBroadcast(@Payload('numbers') payload: number[]): Observable<number> {
		return new Observable((observer) => {
			payload.reduce((acc, ele) => {
				acc = acc + ele;
				observer.next(acc);
				return acc;
			}, 0);
			observer.complete();
		});
	}
}
