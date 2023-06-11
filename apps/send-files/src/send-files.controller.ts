import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SendFilesService } from './send-files.service';
@Controller()
export class SendFilesController {
	constructor(private readonly sendFilesService: SendFilesService) {}

	@Get('file/stream')
	async getReadStream(@Res({ passthrough: true }) res) {
		this.sendFilesService.getReadStream(res);
	}

	@Get('file/rxjs/stream')
	getRxJSFile(@Res({ passthrough: true }) res): Observable<StreamableFile> {
		return this.sendFilesService.getRxJSFile(res);
	}
}
