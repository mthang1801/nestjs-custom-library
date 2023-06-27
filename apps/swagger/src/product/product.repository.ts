import { CONNECTION_NAME } from '@app/common';
import { Product, ProductDocument } from '@app/common/schemas/product.schema';
import { AbstractRepository } from '@app/shared';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class ProductRepository extends AbstractRepository<ProductDocument> {
	protected logger = new Logger(ProductRepository.name);

	constructor(
		@InjectModel(Product.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<ProductDocument>,
		@InjectModel(Product.name, CONNECTION_NAME.PRIMARY)
		readonly secondaryModel: Model<ProductDocument>,
	) {
		super(primaryModel, secondaryModel);
	}
}
