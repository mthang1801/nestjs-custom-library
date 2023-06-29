import { AbstractRepository, CONNECTION_NAME } from '@app/shared';
import { Product, ProductDocument } from '@app/shared/schemas/product.schema';
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
