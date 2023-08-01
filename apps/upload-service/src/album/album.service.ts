import { AbstractService, AlbumDocument } from '@app/shared';
import { Injectable, Logger, NotFoundException, Scope } from '@nestjs/common';
import { AlbumRepository } from './album.repository';

@Injectable({ scope: Scope.REQUEST })
export class AlbumService extends AbstractService<AlbumDocument> {
	logger = new Logger(AlbumService.name);
	constructor(readonly albumRepository: AlbumRepository) {
		super(albumRepository);
	}

	async uploadAlbum(file: Express.Multer.File) {
		const payload = {
			filename: file.filename,
			path: file.path,
			mimetype: file.mimetype,
		};
		return this.repository.findOneAndUpdate(payload, payload, { upsert: true });
	}

	async getMetadata(id: string) {
		const album = await this._findById(id);
		if (!album) throw new NotFoundException();
		return album;
	}
}
