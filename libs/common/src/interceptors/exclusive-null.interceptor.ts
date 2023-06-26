import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { recursivelyStripNullValues } from '../utils/function.utils';

@Injectable()
export class ExclusiveNullInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const now = Date.now();
		return next.handle().pipe(
			map(recursivelyStripNullValues),
			tap(() => Logger.log(`After... ${Date.now() - now}ms`, 'Interceptor')),
		);
	}
}
