import { Category } from '@app/common/schemas/category.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
	constructor(private readonly categoryRepository: CategoryRepository) {}
	async create(createCategoryDto: CreateCategoryDto) {
		const payloadData: Partial<Category> = { ...createCategoryDto };
		if (createCategoryDto.parent) {
			const parentCategory = await this.findById(createCategoryDto.parent);
			if (!parentCategory)
				throw new BadRequestException('Không tìm thấy danh mục cha');
			payloadData.parent = parentCategory;
			payloadData.level = parentCategory.level + 1;
			payloadData.path = parentCategory.path;
		}
		const newCategory = await this.categoryRepository.create(payloadData);

		newCategory.path = [payloadData.path, newCategory._id]
			.filter(Boolean)
			.join('/');
		await newCategory.save();

		return newCategory;
	}

	findAll() {
		return `This action returns all category`;
	}

	findById(id: string) {
		return this.categoryRepository.findById(id);
	}

	findOne(id: number) {
		return `This action returns a #${id} category`;
	}

	update(id: number, updateCategoryDto: UpdateCategoryDto) {
		return `This action updates a #${id} category`;
	}

	remove(id: number) {
		return `This action removes a #${id} category`;
	}
}
