import UploadFileInterceptor from '@app/shared/upload/upload-file.interceptor';
import {
	BadRequestException,
	Controller,
	Get,
	Header,
	Headers,
	Param,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
	constructor(private readonly videoService: VideoService) {}
	@Post()
	@UseInterceptors(
		UploadFileInterceptor({
			fieldName: 'file',
			path: 'videos',
			fileFilter(req, file, callback) {
				if (!file.mimetype.includes('video'))
					callback(new BadRequestException(), false);
				callback(null, true);
			},
		}),
	)
	async uploadVideo(@UploadedFile() file: Express.Multer.File) {
		return this.videoService.uploadVideo(file);
	}

	@Get(':id')
	@Header('Accept-Ranges', 'bytes')
	async findById(
		@Param('id') id: string,
		@Headers('accept-ranges') range: any,
		@Res({ passthrough: true }) response: Response,
	) {
		if (!range) {
			return this.videoService.getVideoStreamById(id);
		}
		const { contentRange, streamableFile } =
			await this.videoService.getPartialVideoStreamById(id, range);

		response.status(206);
		response.set({
			'Content-Range': contentRange,
		});

		return streamableFile;
	}
}
