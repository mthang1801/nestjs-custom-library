import { Controller, Get, MessageEvent, Param, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
@Controller()
export class AppController {
	@Get()
	renderPage(@Res() res: Response) {
		res.send('index.html');
	}

	@Sse(':company/:userId')
	getUserInfoByCompanyAndId(
		@Param('company') company: string,
		@Param('userId') userId: string,
	): Observable<MessageEvent> {
		const data = {
			company,
			userId,
			fullName: 'Mai Van Thang',
			dob: new Date('1999/09/09'),
			email: 'mthang1801@gmail.com',
			role: 'Admin',
			created_at: new Date('2023/01/01'),
		};

		return interval(2000).pipe(
			map((_) => {
				console.log(data);
				return { data };
			}),
		);
	}
}
