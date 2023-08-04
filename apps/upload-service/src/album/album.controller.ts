import UploadFileInterceptor from '@app/shared/upload/upload-file.interceptor';
import UploadFilesInterceptor from '@app/shared/upload/upload-files.interceptor';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { AlbumService } from './album.service';

@Controller('albums')
export class AlbumController {
	constructor(private readonly albumService: AlbumService) {}
	@Post()
	@UseInterceptors(
		UploadFileInterceptor({
			fieldName: 'file',
			path: 'images',

			fileFilter(req, file, callback) {
				if (/image/gi.test(file.mimetype)) return callback(null, true);
				return callback(new BadRequestException(), false);
			},
		}),
	)
	async uploadAlbum(@UploadedFile() file: Express.Multer.File) {
		return this.albumService.uploadAlbum(file);
	}

	@Get(':id')
	async getAlbum(
		@Param('id') id: string,
		@Res({ passthrough: true }) response: Response,
	) {
		const albumMetadata = await this.albumService.getMetadata(id);

		const stream = createReadStream(albumMetadata.path);

		response.set({
			'Content-Disposition': `attachment; filename="${albumMetadata.filename}"`,
			'Content-Type': 'application/json',
		});

		return new StreamableFile(stream);
	}

	@Post('upload-multi')
	@UseInterceptors(
		UploadFilesInterceptor({
			fieldName: 'files',
			path: 'images',
			maxCount: 100,
			fileFilter(req, file, callback) {
				if (!file.mimetype.includes('image'))
					return callback(new BadRequestException(), false);
				return callback(null, true);
			},
		}),
	)
	uploadArrayOfAlbums(@UploadedFiles() files: Express.Multer.File[]) {
		return {
			status: 'Success',
		};
	}
}
