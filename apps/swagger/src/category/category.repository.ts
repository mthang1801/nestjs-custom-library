import { CONNECTION_NAME } from '@app/shared';
import { AbstractRepository } from '@app/shared/abstract';
import { Posts } from '@app/shared/schemas';
import { CategoryDocument } from '@app/shared/schemas/category.schema';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class CategoryRepository extends AbstractRepository<CategoryDocument> {
	protected logger = new Logger(CategoryRepository.name);

	constructor(
		@InjectModel(Posts.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<CategoryDocument>,
		@InjectModel(Posts.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<CategoryDocument>,
	) {
		super({ primaryModel, secondaryModel });
	}
}
