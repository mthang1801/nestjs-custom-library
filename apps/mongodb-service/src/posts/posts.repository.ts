import { CONNECTION_NAME } from '@app/shared';
import { AbstractRepository } from '@app/shared/abstract';
import { Posts, PostsDocument } from '@app/shared/schemas';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class PostsRepository extends AbstractRepository<PostsDocument> {
	protected logger = new Logger(PostsRepository.name);

	constructor(
		@InjectModel(Posts.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<PostsDocument>,
		@InjectModel(Posts.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<PostsDocument>,
	) {
		super(primaryModel, secondaryModel);
	}
}
