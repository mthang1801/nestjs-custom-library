import { MongooseDynamicModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from '@app/shared/schemas/category.schema';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: Category.name,
			schema: CategorySchema,
		}),
	],
	controllers: [CategoriesController],
	providers: [CategoriesService],
})
export class CategoriesModule {}
