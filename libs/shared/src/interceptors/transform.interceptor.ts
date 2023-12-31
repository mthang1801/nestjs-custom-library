import { AbstractType } from '@app/shared/abstract/types/abstract.type';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONSTANT_HTTP_RESPONSE } from '../constants';
import { ResponseData } from '../interfaces';
import { typeOf } from '../utils/function.utils';
import { UtilService } from '../utils/util.service';

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, ResponseData<T>>
{
	private logger = new Logger(TransformInterceptor.name);
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<ResponseData<T>> | Observable<any> {
		const response = context.switchToHttp().getResponse();
		const request = context.switchToHttp().getRequest();
		const before = Date.now();

		return next.handle().pipe(
			map(
				(res) => {
					const statusCode = response.statusCode || 200;
					return this.responseData(res, context, statusCode);
				},
				catchError((err) => {
					throw new HttpException(
						err?.response?.message || err.message,
						err.status,
					);
				}),
			),
		);
	}

	private responseData(
		res: any,
		context: ExecutionContext,
		statusCode,
	): ResponseData<T> {
		const success = statusCode < 400;

		const message = res?.message || CONSTANT_HTTP_RESPONSE[statusCode || 200];

		const response: ResponseData<T> = {
			success,
			statusCode,
			data: this.serializeData(res),
			message,
			metadata: this.getMetadata(res, context),
		};

		return response;
	}

	getMetadata(res: any, context: ExecutionContext): AbstractType.Metadata {
		if (res?.metadata) return res.metadata;
		if (res?.count) {
			const totalItems = res.count;
			const req: Request = context.switchToHttp().getRequest();
			const { page, limit } = new UtilService().getPageSkipLimit(req.query);
			return {
				totalItems: totalItems,
				currentPage: page,
				perPage: limit,
				totalPages:
					Number(totalItems) % Number(limit) === 0
						? Number(totalItems) / Number(limit)
						: Math.ceil(Number(totalItems) / Number(limit)),
			};
		}
		return undefined;
	}

	private serializeData(res) {
		if (!res) return null;

		if (res?.data) return res.data;

		if (res?.items && (res?.count || res?.metadata)) {
			return res.items;
		}

		if (typeOf(res) === 'object' && _.isEmpty(res)) {
			return null;
		}

		return res;
	}
}
