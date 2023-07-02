import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class WebsocketInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ws = context.switchToWs();
		return next.handle().pipe(
			map((data) => ({
				success: true,
				statusCode: 200,
				message: 'Success',
				data,
			})),
		);
	}
}
