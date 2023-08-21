import { ENUM_EVENT_PATTERN, ENUM_QUEUES } from '@app/shared';
import { UtilService } from '@app/shared/utils/util.service';
import {
    BadRequestException,
    HttpException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class PublishService {
	constructor(
		@Inject(ENUM_QUEUES.TEST_ACK) private readonly client: ClientProxy,
		private readonly utilService: UtilService,
	) {}

	status: 'PROCESSING' | 'READY' = 'READY';

	async onPushNotiOrder(payload) {
		try {
			if (this.status === 'PROCESSING') throw new BadRequestException('Fail');
			this.status = 'PROCESSING';
			await this.utilService.debounce(1000);

			console.log('onPushNotiOrder::', payload);
			this.status = 'READY';
		} catch (error) {
			console.log(error);
			throw new HttpException('Fail', 400);
		}
	}

	publishToQueue(pattern, payload) {
		this.client.emit(pattern, payload);
	}

	async generatePayload(payload: any) {
		for (let i = 0; i < 100; i++) {
			console.log(i);
			this.publishToQueue(ENUM_EVENT_PATTERN.PUSH_MANY_NOTI_ORDER, {
				...payload,
				count: i,
				timestamp: Date.now(),
			});
		}
	}
}
