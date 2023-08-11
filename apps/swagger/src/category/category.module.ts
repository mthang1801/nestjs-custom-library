import { LibMongoModule } from '@app/shared';
import { Category, CategorySchema } from '@app/shared/schemas/category.schema';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

@Module({
	imports: [
		LibMongoModule.forFeatureAsync({
			name: Category.name,
			schema: CategorySchema,
		}),
	],
	controllers: [CategoryController],
	providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
