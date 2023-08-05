import { LibMongoModule } from '@app/shared';
import { Video, VideoSchema } from '@app/shared/schemas/video.schema';
import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoRepository } from './video.repository';
import { VideoService } from './video.service';

@Module({
	imports: [
		LibMongoModule.forFeatureAsync({ name: Video.name, schema: VideoSchema }),
	],
	controllers: [VideoController],
	providers: [VideoService, VideoRepository],
})
export class VideoModule {}
