import { MongooseDynamicModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoriesModule } from './inventories/inventories.module';
import { MongoServiceController } from './mongo-service.controller';
import { MongoServiceService } from './mongo-service.service';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ProductsModule,
		OrdersModule,
		InventoriesModule,
		MongooseDynamicModule.registerAsync(),
		CategoryModule,
		UsersModule,
	],
	controllers: [MongoServiceController],
	providers: [MongoServiceService],
})
export class MongoServiceModule {}
