import { AbstractService } from '@app/shared';
import { VideoDocument } from '@app/shared/schemas/video.schema';
import { BadRequestException } from '@app/shared/swagger';
import { UtilService } from '@app/shared/utils/util.service';
import {
	Injectable,
	Logger,
	NotFoundException,
	StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import * as rangeParser from 'range-parser';
import { VideoRepository } from './video.repository';
@Injectable()
export class VideoService extends AbstractService<VideoDocument> {
	logger = new Logger(VideoService.name);
	constructor(
		private readonly videoRepository: VideoRepository,
		private readonly utilService: UtilService,
	) {
		super(videoRepository);
	}

	async uploadVideo(file: Express.Multer.File) {
		const payload = {
			path: file.path,
			mimetype: file.mimetype,
			filename: file.filename,
		};

		return this._findOneAndUpdate(payload, payload, {
			upsert: true,
		});
	}

	async getVideoMetadata(id: string) {
		const videoMetadatta = await this._findById(id);
		if (videoMetadatta) return videoMetadatta;
		throw new NotFoundException();
	}

	async getVideoStreamById(id: string) {
		const videoMetadata = await this.getVideoMetadata(id);
		const stream = createReadStream(videoMetadata.path);
		return new StreamableFile(stream, {
			disposition: `inline; filename="${videoMetadata.filename}"`,
			type: videoMetadata.mimetype,
		});
	}

	async getPartialVideoStreamById(id: string, range: string) {
		const videoMetadata = await this.getVideoMetadata(id);
		const fileSize = this.utilService.getFileSize(videoMetadata.path);
		const { start, end } = await this.parseRange(range, fileSize);
		const stream = createReadStream(videoMetadata.path, {
			start,
			end,
		});

		const streamableFile = new StreamableFile(stream, {
			disposition: `inline; filename="${videoMetadata.filename}"`,
			type: videoMetadata.mimetype,
		});

		const contentRange = this.getContentRange(start, end, fileSize);

		return {
			streamableFile,
			contentRange,
		};
	}

	parseRange(range: string, fileSize: number) {
		const parseResult: any = rangeParser(fileSize, range);
		if ([-1, -2].includes(parseResult) || !rangeParser.length)
			throw new BadRequestException();
		return parseResult[0];
	}

	getContentRange(rangeStart: number, rangeEnd: number, fileSize: number) {
		return `bytes ${rangeStart}-${rangeEnd}/${fileSize}`;
	}
}
