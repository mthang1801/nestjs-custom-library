import { Injectable, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Observable, of } from 'rxjs';

@Injectable()
export class SendFilesService {
	async getReadStream(res: Response) {
		const file = await readFile(join(process.cwd(), 'public/files/music.mp4'));
		res.set({
			'Content-Type': 'video/mp4',
			'Content-Disposition': 'attachment;filename=mv.mp4',
			length: file.byteLength,
		});
		return new StreamableFile(file);
	}

	getRxJSFile(res): Observable<StreamableFile> {
		return of(this.getReadStream(res));
	}
}
