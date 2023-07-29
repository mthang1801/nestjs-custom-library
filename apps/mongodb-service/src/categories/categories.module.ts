import { LibMongoModule } from '@app/shared';
import { Category, CategorySchema } from '@app/shared/schemas/category.schema';
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
	imports: [
		LibMongoModule.forFeatureAsync({
			name: Category.name,
			schema: CategorySchema,
		}),
	],
	controllers: [CategoriesController],
	providers: [CategoriesService],
})
export class CategoriesModule {}
