import { CONNECTION_NAME } from '@app/common';
import { Posts } from '@app/common/schemas';
import { CategoryDocument } from '@app/common/schemas/category.schema';
import { AbstractRepository } from '@app/shared/abstract';
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
		super(primaryModel, secondaryModel);
	}
}
