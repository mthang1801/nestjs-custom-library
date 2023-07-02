import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { TelegramService } from 'nestjs-telegram';
import { typeOf } from '../utils/function.utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		protected readonly configService: ConfigService,
		protected readonly telegramService: TelegramService,
	) {}
	protected logger = new Logger(AllExceptionsFilter.name);
	protected serviceName = AllExceptionsFilter.name;

	async catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res: Response = ctx.getResponse();
		const req: Request = ctx.getRequest();

		const statusCode = this.getStatusCode(exception);

		const message = this.getMessage(exception);

		this.writeLogger(message, req, exception);
		await this.sendToTelegram(exception);

		res.status(statusCode).json({
			success: false,
			statusCode,
			data: null,
			message,
		});
	}

	getStatusCode(exception: HttpException): number {
		const statusCode =
			exception instanceof HttpException
				? exception.getStatus() || 500
				: HttpStatus.INTERNAL_SERVER_ERROR;

		return statusCode;
	}

	getMessage(exception: HttpException): string {
		let messageResponse: any;
		if ((exception as any) instanceof HttpException) {
			messageResponse = exception.getResponse() || exception.message;
		} else if (exception instanceof Error) {
			messageResponse =
				exception['errors'] && typeOf(exception['errors']) === 'array'
					? exception['errors'][0]
					: exception;
		} else {
			messageResponse = exception['message'] || 'Internal server';
		}

		let messageResult = '';
		if (messageResponse instanceof Object) {
			if (typeOf(messageResponse) === 'array') {
				messageResult = messageResponse.filter(Boolean).join(', ');
			} else if (typeOf(messageResponse) === 'object') {
				messageResult = Object.values(messageResponse)
					.filter(Boolean)
					.join(', ');
			}
		} else {
			messageResult = messageResponse;
		}

		return messageResult || 'Internal server';
	}

	writeLogger(message: string, req: Request, exception: HttpException) {
		const stack = [
			{ stack: exception.stack },
			{ url: req.url },
			{ method: req.method },
			{ body: req.body },
			{ params: req['params'] },
			{ query: req['query'] },
		];

		this.logger.error(message, stack, exception.name);
	}

	async sendToTelegram(exception: HttpException) {
		this.logger.error(`🤬😡😤🤯 [${this.serviceName}] ${exception}`);

		await this.telegramService
			.sendMessage({
				chat_id: this.configService.get<string>('TELEGRAM_GROUP_ID'),
				text: `🤬😡😤🤯 [${exception.name}]-->${exception.message}-->${exception.stack}`,
			})
			.toPromise();
	}
}
