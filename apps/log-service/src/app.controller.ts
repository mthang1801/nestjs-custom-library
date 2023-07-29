import { ENUM_PATTERN, RMQClientService } from '@app/shared';
import { LogActionPayload } from '@app/shared/abstract/types/abstract.type';
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
	) {}
	@MessagePattern({ cmd: ENUM_PATTERN.SAVE_ACTION })
	async saveLogAction(
		@Payload() payload: LogActionPayload<any>,
		@Ctx() context: RmqContext,
	) {
		this.logger.log(
			'🚀 ~ file: app.controller.ts:9 ~ AppController ~ onLogAction ~ onLogAction:',
		);

		try {
			await this.appService.saveLogAction(payload);
			// throw new RpcException('Not Handling');
			this.rmqClientService.ack(context);
		} catch (error) {
			console.log(error);
			throw new RpcException(error.message);
		}
	}
}
