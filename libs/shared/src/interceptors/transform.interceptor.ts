import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CONSTANT_HTTP_RESPONSE } from '../constants';
import { ResponseData } from '../interfaces';
import { typeOf } from '../utils/function.utils';

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
		const now = Date.now();
		return next.handle().pipe(
			map(
				(res) => {
					const statusCode = response.statusCode || 200;
					return this.responseData(res, statusCode);
				},
				catchError((err) => {
					throw new HttpException(
						err?.response?.message || err.message,
						err.status,
					);
				}),
			),
			tap(() => this.logger.log(`After... ${Date.now() - now}ms`)),
		);
	}

	private responseData(res: any, statusCode): ResponseData<T> {
		const success = statusCode < 400;
		const metadata = res?.metadata;

		const message =
			res?.message ||
			CONSTANT_HTTP_RESPONSE[statusCode] ||
			CONSTANT_HTTP_RESPONSE['500'];

		const serializedData = this.serializeData(res);

		const response: ResponseData<T> = {
			success,
			statusCode,
			data: serializedData,
			message,
			metadata,
		};

		return response;
	}

	private serializeData(res) {
		delete res.metadata;

		if (typeOf(res) === 'array' && _.isEmpty(res)) {
			return [];
		}

		if (typeOf(res) === 'object' && _.isEmpty(res)) {
			return null;
		}

		return res;
	}
}
