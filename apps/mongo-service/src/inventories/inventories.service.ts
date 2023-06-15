import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryRepository } from './inventories.repository';

@Injectable()
export class InventoriesService {
	constructor(private readonly inventoryRepository: InventoryRepository) {}
	create(createInventoryDto: CreateInventoryDto) {
		return 'This action adds a new inventory';
	}

	async findAll() {
		return this.inventoryRepository.find(
			{},
			{},
			{ populate: { path: 'product' } },
		);
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
