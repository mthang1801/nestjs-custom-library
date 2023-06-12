import { Module } from '@nestjs/common';
import { MongoServiceController } from './mongo-service.controller';
import { MongoServiceService } from './mongo-service.service';
import { InventoriesModule } from './inventories/inventories.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

@Module({
	imports: [ProductsModule, OrdersModule, InventoriesModule],
	controllers: [MongoServiceController],
	providers: [MongoServiceService],
})
export class MongoServiceModule {}
