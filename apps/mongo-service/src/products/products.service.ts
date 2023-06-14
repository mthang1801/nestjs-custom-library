import { CONNECTION_NAME } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name, CONNECTION_NAME.PRIMARY)
		private readonly productModel: Model<Product>,
	) {}
	create(createProductDto: CreateProductDto) {
		// return this.productRepository.create(createProductDto);
	}

	findAll() {
		// return this.productModel.find();
	}

	findOne(id: number) {
		return `This action returns a #${id} product`;
	}

	update(id: number, updateProductDto: UpdateProductDto) {
		return `This action updates a #${id} product`;
	}

	remove(id: number) {
		return `This action removes a #${id} product`;
	}
}
