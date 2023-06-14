import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schema/product.schema';
import { MongooseDynamicModule } from '@app/common';

@Module({
	imports: [
		// MongooseDynamicModule.forFeatureAsync({
		// 	name: Product.name,
		// 	schema: ProductSchema,
		// }),
		// MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		MongooseDynamicModule.forFeature({
			name: Product.name,
			schema: ProductSchema,
		}),
	],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}
