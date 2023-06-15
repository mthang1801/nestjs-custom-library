import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoriesService } from './inventories.service';

@Controller('inventories')
export class InventoriesController {
	constructor(private readonly inventoriesService: InventoriesService) {}

	@Post()
	create(@Body() createInventoryDto: CreateInventoryDto) {
		return this.inventoriesService.create(createInventoryDto);
	}

	@Get()
	async findAll() {
		return this.inventoriesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.inventoriesService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateInventoryDto: UpdateInventoryDto,
	) {
		return this.inventoriesService.update(+id, updateInventoryDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.inventoriesService.remove(+id);
	}
}
