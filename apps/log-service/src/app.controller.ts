import {
    ActionLog,
    ENUM_EVENT_PATTERN,
    LibActionLogService,
    RMQClientService,
} from '@app/shared';
import { Controller, Logger } from '@nestjs/common';
import {
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
    RpcException,
} from '@nestjs/microservices';
import { AppService } from './app.service';
@Controller()
export class AppController {
	logger = new Logger(AppController.name);

	constructor(
		private readonly rmqClientService: RMQClientService,
		private readonly appService: AppService,
		private readonly actionLogService: LibActionLogService,
	) {}

	@MessagePattern(ENUM_EVENT_PATTERN.SAVE_ACTION)
	async saveLogAction(
		@Payload() payload: ActionLog<any, any>,
		@Ctx() context: RmqContext,
	) {
		this.logger.log(`${'*'.repeat(20)} saveLogAction() ${'*'.repeat(20)}`);

		try {
			await this.actionLogService.save(payload);
		} catch (error) {
			throw new RpcException(error.message);
		} finally {
			this.rmqClientService.ack(context);
		}
	}
}
