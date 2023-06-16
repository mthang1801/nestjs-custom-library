import { Product } from '@app/common/schemas';
import { getPageSkipLimit } from '@app/common/utils/function.utils';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
	constructor(private readonly productRepository: ProductRepository) {}
	async create(createProductDto: CreateProductDto) {
		return this.productRepository.create(createProductDto);
	}

	async findAll(query: FindProductDto) {
		const { page, skip, limit } = getPageSkipLimit(query);
		return this.productRepository.find(
			query,
			{},
			{
				skip,
				limit,
				populate: [
					{ path: 'inventories', select: 'stock_quantity product_id' },
					{ path: 'categories' },
				],
			},
		);
	}

	async findOne(id: string): Promise<Product> {
		return this.productRepository.findOne(
			{ _id: id },
			{},
			{ populate: [{ path: 'inventories' }, { path: 'categories' }] },
		);
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		return this.productRepository.findOneAndUpdate(
			{ _id: new mongoose.Types.ObjectId(id) },
			updateProductDto,
		);
	}

	async remove(id: number) {
		return await this.productRepository
			.aggregateBuilder()
			.match({ status: 'INACTIVE' });
	}
}
