import { AbstractRepository, CONNECTION_NAME } from '@app/common';
import { Inventory, InventoryDocument } from '@app/common/schemas';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InventoryRepository extends AbstractRepository<InventoryDocument> {
	protected readonly logger = new Logger(InventoryRepository.name);
	constructor(
		@InjectModel(Inventory.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<InventoryDocument>,
		@InjectModel(Inventory.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<InventoryDocument>,
	) {
		super(primaryModel, secondaryModel);
	}
}
