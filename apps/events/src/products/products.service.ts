import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PRODUCT, PRODUCT_CREATED } from '../events.name';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductCreatedEvent } from './events/product-created.event';

@Injectable()
export class ProductsService {
	private readonly logger = new Logger(ProductsService.name);
	private products: ProductEntity[] = [];
	constructor(private readonly eventEmitter: EventEmitter2) {}
	create(createProductDto: CreateProductDto) {
		const product = {
			id: Date.now(),
			...createProductDto,
		};
		this.products.push(product);

		const productEvent = new ProductCreatedEvent(product);
		this.eventEmitter.emit(PRODUCT_CREATED, productEvent);
	}

	@OnEvent(PRODUCT_CREATED, { async: true })
	handleProductCreated(payload: ProductCreatedEvent) {
		this.logger.log(`[EVENT] ${PRODUCT_CREATED}::`);
		this.logger.log(JSON.stringify(payload));
	}

	@OnEvent(PRODUCT, { async: true })
	handleProduct(payload: ProductCreatedEvent) {
		this.logger.log(`[EVENT] ${PRODUCT}::`);
		this.logger.log(JSON.stringify(payload));
	}

	findAll() {
		return `This action returns all products`;
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
