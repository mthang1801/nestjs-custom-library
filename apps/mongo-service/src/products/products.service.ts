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
		return this.productRepository.find(query);
	}

	async findOne(id: string) {
		return this.productRepository.findOne(
			{ _id: id },
			{ name: 1, price: 1, short_description: 1 },
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
