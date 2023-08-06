import {
	CatchRpcExceptionFilter,
	ENUM_PATTERN,
	RMQClientService,
} from '@app/shared';
import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import {
	Ctx,
	EventPattern,
	Payload,
	RmqContext,
	RpcException,
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
	@EventPattern(ENUM_PATTERN.PUSH_MANY_NOTI_ORDER)
	async onPushNotiOrder(@Payload() payload, @Ctx() context: RmqContext) {
		try {
			await this.publishService.onPushNotiOrder(payload);
			this.RMQClientService.ack(context);
		} catch (error) {
			console.log('onPushNotiOrder::', error.message);
			// throw new RpcException(error.message);
			return;
		}
	}

	@Post()
	generatePayload(@Body() payload: any) {
		return this.publishService.generatePayload(payload);
	}
}
