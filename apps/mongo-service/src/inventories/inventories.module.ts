import { MongooseDynamicModule } from '@app/common';
import { Inventory, InventorySchema } from '@app/common/schemas';
import { Module } from '@nestjs/common';
import { InventoriesController } from './inventories.controller';
import { InventoryRepository } from './inventories.repository';
import { InventoriesService } from './inventories.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeature({
			name: Inventory.name,
			schema: InventorySchema,
		}),
	],
	controllers: [InventoriesController],
	providers: [InventoriesService, InventoryRepository],
})
export class InventoriesModule {}
