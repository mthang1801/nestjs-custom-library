import {
    CatchRpcExceptionFilter,
    ENUM_EVENT_PATTERN,
    RMQClientService,
} from '@app/shared';
import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import {
    Ctx,
    EventPattern,
    Payload,
    RmqContext
} from '@nestjs/microservices';
import { PublishService } from './publish.service';
@Controller('publish')
@UseFilters(new CatchRpcExceptionFilter())
export class PublishController {
	constructor(
		private readonly publishService: PublishService,
		private readonly RMQClientService: RMQClientService,
	) {}
	status = 'PROCESSING';
	@EventPattern(ENUM_EVENT_PATTERN.PUSH_MANY_NOTI_ORDER)
	async onPushNotiOrder(@Payload() payload, @Ctx() context: RmqContext) {
		try {
			console.log('onPushNotiOrder::Payload::', payload);
			await this.publishService.onPushNotiOrder(payload);
		} catch (error) {
			console.log('onPushNotiOrder::Error', error.message);
			this.publishService.publishToQueue(
				ENUM_EVENT_PATTERN.PUSH_MANY_NOTI_ORDER,
				payload,
			);
			// throw new RpcException(error.message);
			return;
		} finally {
			this.RMQClientService.ack(context);
		}
	}

	@Post()
	generatePayload(@Body() payload: any) {
		return this.publishService.generatePayload(payload);
	}
}
