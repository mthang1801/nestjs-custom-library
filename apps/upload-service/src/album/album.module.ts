import { Album, AlbumSchema, LibMongoModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './album.repository';
import { AlbumService } from './album.service';

@Module({
	imports: [
		LibMongoModule.forFeatureAsync({ name: Album.name, schema: AlbumSchema }),
	],
	controllers: [AlbumController],
	providers: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
