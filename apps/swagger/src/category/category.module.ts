import { MongooseDynamicModule } from '@app/common';
import { Category, CategorySchema } from '@app/common/schemas/category.schema';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: Category.name,
			schema: CategorySchema,
		}),
	],
	controllers: [CategoryController],
	providers: [CategoryService],
})
export class CategoryModule {}
