import { ENUM_ACTION, ENUM_EVENT_MODULE } from '@app/shared/constants/enum';
import { event } from '@app/shared/utils/helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { v4 as uuid } from 'uuid';
import { InventoryService } from '../inventory/inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
@Injectable()
export class ProductService {
	constructor(
		private readonly eventEmitter: EventEmitter2,
		private readonly inventoryService: InventoryService,
	) {}
	private products: Product[] = [];
	async create(createProductDto: CreateProductDto) {
		const newProduct = new Product({
			...createProductDto,
			id: uuid(),
		});
		this.products.push(newProduct);
		this.eventEmitter.emit(
			event(ENUM_EVENT_MODULE.PRODUCT, ENUM_ACTION.CREATE),
			{ newProduct, inventories: createProductDto.inventories },
		);

		return newProduct;
	}

	@OnEvent(event(ENUM_EVENT_MODULE.PRODUCT, ENUM_ACTION.CREATE), {
		async: true,
	})
	async onCreatedProduct({ newProduct, inventories }) {
		this.eventEmitter.emit(
			event(ENUM_EVENT_MODULE.INVENTORY, ENUM_ACTION.CREATE),
			{
				newProduct,
				inventories,
			},
		);
		return { status: true };
	}

	findAll() {
		return `This action returns all product`;
	}

	findOne(id: string) {
		const product = this.products.find(({ id: productId }) => productId === id);
		if (!product) throw new NotFoundException();
		const inventories = this.inventoryService.findByProductId(id);
		return {
			...product,
			inventories,
		};
	}

	update(id: number, updateProductDto: UpdateProductDto) {
		return `This action updates a #${id} product`;
	}

	remove(id: number) {
		return `This action removes a #${id} product`;
	}
}
