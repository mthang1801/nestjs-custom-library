import { CONNECTION_NAME } from '@app/shared';
import { AbstractRepository } from '@app/shared/abstract';
import { ExpressContext } from '@app/shared/abstract/types/abstract.type';
import { Posts, PostsDocument } from '@app/shared/schemas';
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
export class PostsRepository extends AbstractRepository<PostsDocument> {
	protected logger = new Logger(PostsRepository.name);

	constructor(
		@InjectModel(Posts.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<PostsDocument>,
		@InjectModel(Posts.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<PostsDocument>,
		// @InjectModel(PostLog.name, CONNECTION_NAME.PRIMARY)
		// readonly primaryLogModel: Model<PostLogDocument>,
		// @InjectModel(PostLog.name, CONNECTION_NAME.SECONDARY)
		// readonly secondaryLogModel: Model<PostLogDocument>,
		@Inject(CONTEXT) readonly context: ExpressContext,
	) {
		super({
			primaryModel,
			secondaryModel,
			// primaryLogModel,
			// secondaryLogModel,
			context,
		});
	}
}
