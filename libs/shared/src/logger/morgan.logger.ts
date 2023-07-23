import { Request, Response } from 'express';
import * as morgan from 'morgan';

export const MorganLogger = () => {
	return morgan(function (tokens, req: Request, res: Response) {
		return [
			[
				tokens.method(req, res),
				tokens.url(req, res),
				'-',
				tokens.status(req, res),
				tokens.res(req, res, 'content-length'),
				'-',
				tokens['response-time'](req, res),
				'ms',
			].join(' '),
			Object.entries(req.body).length
				? `data: ${JSON.stringify(req.body)}`
				: undefined,
			'\n',
		]
			.filter(Boolean)
			.join('\n');
	});
};
