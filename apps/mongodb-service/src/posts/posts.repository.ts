import { CONNECTION_NAME } from '@app/shared';
import { AbstractRepository } from '@app/shared/abstract';
import { AbstractType } from '@app/shared/abstract/types/abstract.type';
import { Posts, PostsDocument } from '@app/shared/schemas';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
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

		@Inject(CONTEXT) readonly context: AbstractType.ExpressContext,
	) {
		super({
			primaryModel,
			secondaryModel,
			context,
		});
	}
}
