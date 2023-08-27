import {
  AbstractRepository,
  CONNECTION_NAME,
  PostsDocument,
} from '@app/shared';
import { Injectable, Logger, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class PostRepository extends AbstractRepository<PostsDocument> {
	logger = new Logger(PostRepository.name);
	constructor(
		@InjectModel(Post.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<PostsDocument>,
		@InjectModel(Post.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<PostsDocument>,
	) {
		super({ primaryModel, secondaryModel });
	}
}
