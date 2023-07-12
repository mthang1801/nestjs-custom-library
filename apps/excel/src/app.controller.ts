import { ExceljsService } from '@app/shared/exceljs/exceljs.service';
import {
	Body,
	Controller,
	Get,
	Header,
	HttpException,
	Post,
	Req,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { createReadStream } from 'fs-extra';
import * as multer from 'multer';
import { join } from 'path';
import { AppService } from './app.service';
@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly exceljsService: ExceljsService,
	) {}
	@Get()
	@Header('Content-Type', 'application/octet-stream')
	@Header('Content-Disposition', 'attachment; filename="export.xlsx"')
	async exportFile(@Res() res: Response) {
		const filepath = await this.appService.exportFile();
		const file = await createReadStream(filepath);
		file.pipe(res);
	}

	@Post()
	@UseInterceptors(
		FileInterceptor('file', {
			storage: multer.diskStorage({
				destination: (req, file, cb) => {
					const targetDir = join(
						process.cwd(),
						'libs/shared/src/exceljs/imports',
					);
					if (!fs.existsSync(targetDir)) {
						fs.mkdirSync(targetDir, { recursive: true });
					}
					cb(null, targetDir);
				},
				filename: (req, file, cb) => {
					const filename = `${req.headers['x-client-id']}-${file.originalname}`;
					return cb(null, filename);
				},
			}),
		}),
	)
	async importFile(
		@Req() req: Request,
		@Body() payload,
		@UploadedFile() file: Express.Multer.File,
	): Promise<any> {
		try {
			await this.appService.importFile(file);
		} catch (error) {
			throw new HttpException(error.message, error.status);
		} finally {
			await this.exceljsService.removeFile(file.path);
		}
	}
}
