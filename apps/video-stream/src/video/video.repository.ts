import { AbstractRepository, CONNECTION_NAME } from '@app/shared';
import { Video, VideoDocument } from '@app/shared/schemas/video.schema';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class VideoRepository extends AbstractRepository<VideoDocument> {
	logger = new Logger(VideoRepository.name);
	constructor(
		@InjectModel(Video.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<VideoDocument>,
		@InjectModel(Video.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<VideoDocument>,
	) {
		super({ primaryModel, secondaryModel });
	}
}
