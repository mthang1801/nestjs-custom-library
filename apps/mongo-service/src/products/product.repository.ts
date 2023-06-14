import { CONNECTION_NAME } from '@app/common';
import { AbstractRepository } from '@app/common/mongoose/abstract.repository';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';

export class ProductRepository extends AbstractRepository<ProductDocument> {
	protected override logger = new Logger(ProductRepository.name);
	constructor(
		@InjectModel(Product.name, CONNECTION_NAME.PRIMARY)
		protected readonly primaryModel: Model<ProductDocument>,
		@InjectModel(Product.name, CONNECTION_NAME.SECONDARY)
		protected readonly secondaryModel: Model<ProductDocument>,
	) {
		super(primaryModel, secondaryModel);
	}
}
