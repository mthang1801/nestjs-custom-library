import { MongooseDynamicModule } from '@app/common';
import { Product, ProductSchema } from '@app/common/schemas/product.schema';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: Product.name,
			schema: ProductSchema,
		}),
	],
	controllers: [ProductController],
	providers: [ProductService],
})
export class ProductModule {}
