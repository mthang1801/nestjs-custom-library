import { CONNECTION_NAME } from '@app/common';
import { AbstractRepository } from '@app/common/mongoose/abstract.repository';
import { Product, ProductDocument } from '@app/common/schemas';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductRepository extends AbstractRepository<ProductDocument> {
	protected override logger = new Logger(ProductRepository.name);
	constructor(
		@InjectModel(Product.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<ProductDocument>,
		@InjectModel(Product.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<ProductDocument>,
	) {
		super(primaryModel, secondaryModel);
	}
}
