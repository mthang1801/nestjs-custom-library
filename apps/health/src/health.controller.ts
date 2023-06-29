import { CONNECTION_NAME, QUEUES } from '@app/shared';
import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RmqOptions, Transport } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';

import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
    MicroserviceHealthIndicator,
    MongooseHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { Connection } from 'mongoose';
import { HealthService } from './health.service';
@Controller('health')
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
		private readonly memoryHealthIndicator: MemoryHealthIndicator,
		private readonly diskHealthIndicator: DiskHealthIndicator,
		private readonly mongooseIndicator: MongooseHealthIndicator,
		@InjectConnection(CONNECTION_NAME.PRIMARY)
		private primaryConnection: Connection,
		@InjectConnection(CONNECTION_NAME.SECONDARY)
		private secondaryConnection: Connection,
		@Inject(QUEUES.HEALTH_CHECK) private readonly rmqClient: ClientProxy,
		private readonly microserviceHealthIndicator: MicroserviceHealthIndicator,
		private readonly configService: ConfigService,
		private readonly httpHealthIndicator: HttpHealthIndicator,
		private readonly service: HealthService,
	) {}

	@Get()
	@HealthCheck()
	healthCheck() {
		return this.health.check([
			() => this.typeOrmHealthIndicator.pingCheck('database'),
			() =>
				this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
			() =>
				this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
			() =>
				this.diskHealthIndicator.checkStorage('dist usage', {
					//  the used disk storage should not exceed the 50% of the available space
					thresholdPercent: 0.5,
					path: process.cwd(),
				}),
			() =>
				this.mongooseIndicator.pingCheck('mongoDB Primary', {
					connection: this.primaryConnection,
				}),
			() =>
				this.mongooseIndicator.pingCheck('mongoDB Secondary', {
					connection: this.secondaryConnection,
				}),
			() =>
				this.microserviceHealthIndicator.pingCheck<RmqOptions>('RabbitMQ', {
					transport: Transport.RMQ,
					options: {
						urls: [this.getRmqUrl()],
					},
				}),
			() => this.httpHealthIndicator.pingCheck('HTTP', 'https://google.com'),
			() => this.service.isHealthy('Custom Health'),
		]);
	}

	getRmqUrl() {
		const { username, password, host, port, vHost } =
			this.configService.get('rabbitmq');
		return `amqp://${username}:${password}@${host}:${port}${vHost || '/'}`;
	}
}
