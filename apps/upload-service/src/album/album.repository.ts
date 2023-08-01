import { CONNECTION_NAME } from '@app/shared';
import { AbstractRepository } from '@app/shared/abstract';
import { Album, AlbumDocument } from '@app/shared/schemas';
import {
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	Scope,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class AlbumRepository extends AbstractRepository<AlbumDocument> {
	protected logger = new Logger(AlbumRepository.name);

	constructor(
		@InjectModel(Album.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<AlbumDocument>,
		@InjectModel(Album.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<AlbumDocument>,
		@Inject(CONTEXT) readonly context: ExecutionContext,
	) {
		super({
			primaryModel,
			secondaryModel,
			context,
		});
	}
}
