import { MongoDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
	imports: [MongoDBModule],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}
