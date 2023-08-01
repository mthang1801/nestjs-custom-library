import { Injectable, StreamableFile } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { createReadStream } from 'fs';
import { readFile } from 'fs-extra';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { Readable } from 'typeorm/platform/PlatformTools';
import { NonFile } from './non-file';

@Injectable()
export class AppService {
	private readonly MAX_BYTES = Math.pow(2, 31) - 1;

	getFileStream(): StreamableFile {
		const stream = createReadStream(join(process.cwd(), 'package.json'));
		return new StreamableFile(stream);
	}

	async getBuffer() {
		const file = await readFile(join(process.cwd(), 'README.md'));
		return new StreamableFile(file);
	}

	getNonFile(): NonFile {
		return new NonFile(new Date().toLocaleString());
	}

	getRxjsFile(): Observable<StreamableFile> {
		return of(this.getFileStream());
	}

	async getFileWithHeaders() {
		const file = await readFile(join(process.cwd(), 'README.md'));
		return new StreamableFile(
			createReadStream(join(process.cwd(), 'README.md')),
			{
				type: 'text/markdown',
				disposition: 'attachment; filename="Readme.md"',
				length: file.byteLength,
			},
		);
	}

	getSlowStream(): StreamableFile {
		const stream = new Readable();
		stream.push(Buffer.from(randomBytes(this.MAX_BYTES)));
		stream._read = () => {};
		return new StreamableFile(stream);
	}

	getFileThatDoesNotExist(): StreamableFile {
		return new StreamableFile(createReadStream('does-not-exist.txt'));
	}
}
