import { Controller, Get, Param, ParseIntPipe, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { Observable, interval, map } from 'rxjs';
import { SseService } from './sse.service';

@Controller()
export class SseController {
	constructor(private readonly sseService: SseService) {}

	@Get()
	renderPage(@Res() res: Response) {
		res.render('index.html');
	}

	@Sse('sse/:id')
	sse(@Param('id', ParseIntPipe) id: number): Observable<MessageEvent> {
		return interval(1000).pipe(
			map(
				(_) =>
					({
						data: {
							id: Date.now(),
							userId: id,
							message: 'This is a message from server',
							timestamp: new Date(),
						},
					} as MessageEvent),
			),
		);
	}
}
