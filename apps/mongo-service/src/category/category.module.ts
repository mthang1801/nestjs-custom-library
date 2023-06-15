import { MongooseDynamicModule } from '@app/common';
import { CategorySchema } from '@app/common/schemas/category.schema';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Module({
	imports: [
		MongooseDynamicModule.forFeature({
			name: Category.name,
			schema: CategorySchema,
		}),
	],
	controllers: [CategoryController],
	providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
