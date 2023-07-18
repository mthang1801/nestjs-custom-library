import { CONNECTION_NAME } from '@app/shared';
import { AbstractRepository } from '@app/shared/abstract';
import { Posts, PostsDocument } from '@app/shared/schemas';
import { PostLog, PostLogDocument } from '@app/shared/schemas/post-logs.schema';
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
		@InjectModel(PostLog.name, CONNECTION_NAME.PRIMARY)
		readonly primaryLogModel: Model<PostLogDocument>,
		@InjectModel(PostLog.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryLogModel: Model<PostLogDocument>,
	) {
		super(primaryModel, secondaryModel, primaryLogModel, secondaryLogModel);
	}
}
