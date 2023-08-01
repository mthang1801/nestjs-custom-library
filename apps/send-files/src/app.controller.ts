import { Controller, Get, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { NonFile } from './non-file';
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('file/stream')
	getFileStream(): StreamableFile {
		return this.appService.getFileStream();
	}

	@Get('file/buffer')
	async getBuffer() {
		return this.appService.getBuffer();
	}

	@Get('non-file/pipe-method')
	getNonFile(): NonFile {
		return this.appService.getNonFile();
	}

	@Get('file/rxjs/stream')
	getRxjsFile(): Observable<StreamableFile> {
		return this.appService.getRxjsFile();
	}

	@Get('file/headers')
	getFileWithHeaders(): Promise<StreamableFile> {
		return this.appService.getFileWithHeaders();
	}

	@Get('/file/slow')
	getSlowFile(): StreamableFile {
		return this.appService.getSlowStream();
	}

	@Get('file/not-exist')
	getNonExistantFile(): StreamableFile {
		return this.appService.getFileThatDoesNotExist();
	}
}
