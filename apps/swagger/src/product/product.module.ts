import { LibMongoModule } from '@app/shared';
import { Product, ProductSchema } from '@app/shared/schemas/product.schema';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
	imports: [
		LibMongoModule.forFeatureAsync({
			name: Product.name,
			schema: ProductSchema,
		}),
	],
	controllers: [ProductController],
	providers: [ProductService, ProductRepository],
})
export class ProductModule {}
