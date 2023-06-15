import { AbstractRepository, CONNECTION_NAME } from '@app/common';
import { CategoryDocument } from '@app/common/schemas/category.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryDocument> {
	protected readonly logger = new Logger(CategoryRepository.name);
	constructor(
		@InjectModel(Category.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<CategoryDocument>,
		@InjectModel(Category.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<CategoryDocument>,
	) {
		super(primaryModel, secondaryModel);
	}
}
