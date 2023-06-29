import { ENUM_ACTION, ENUM_EVENT_MODULE } from '@app/shared/constants/enum';
import { event } from '@app/shared/utils/helper';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Product } from '../product/entities/product.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
	private inventories: Inventory[] = [];
	constructor(private readonly eventEmitter: EventEmitter2) {}
	create(createInventoryDto: CreateInventoryDto) {
		return 'This action adds a new inventory';
	}

	@OnEvent(event(ENUM_EVENT_MODULE.INVENTORY, ENUM_ACTION.CREATE))
	handleCreateInventory({
		newProduct,
		inventories,
	}: {
		newProduct: Product;
		inventories: Partial<Inventory[]>;
	}) {
		const inventoryList = inventories.map((inventory) => {
			return new Inventory({
				...inventory,
				product: newProduct,
				price: newProduct.price,
				total_price: newProduct.price * inventory.quantity,
			});
		});
		this.inventories = this.inventories.concat(inventoryList);
	}

	findByProductId(productId) {
		return this.inventories.filter(
			(inventory) => inventory.product.id === productId,
		);
	}
	findAll() {
		return `This action returns all inventory`;
	}

	findOne(id: number) {
		return `This action returns a #${id} inventory`;
	}

	update(id: number, updateInventoryDto: UpdateInventoryDto) {
		return `This action updates a #${id} inventory`;
	}

	remove(id: number) {
		return `This action removes a #${id} inventory`;
	}
}
