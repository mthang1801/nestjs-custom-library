import { MongooseDynamicModule } from '@app/common';
import {
  Product,
  ProductSEO,
  ProductSEOSchema,
  ProductSchema
} from '@app/common/schemas';
import { Module } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeature({
			name: Product.name,
			schema: ProductSchema,
		}),
		MongooseDynamicModule.forFeature({
			name: ProductSEO.name,
			schema: ProductSEOSchema,
		}),
		MongooseDynamicModule.forFeature({
			name: ProductSEO.name,
			schema: ProductSEOSchema,
		}),
	],
	controllers: [ProductsController],
	providers: [ProductsService, ProductRepository],
})
export class ProductsModule {}
