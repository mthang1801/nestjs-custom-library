import { MongooseDynamicModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
	imports: [
		MongooseDynamicModule.forFeature({
			name: Product.name,
			schema: ProductSchema,
		}),
	],
	controllers: [ProductsController],
	providers: [ProductsService, ProductRepository],
})
export class ProductsModule {}
