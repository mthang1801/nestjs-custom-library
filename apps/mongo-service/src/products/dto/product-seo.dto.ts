import { IsOptional } from 'class-validator';

export class ProductSEODto {
	@IsOptional()
	meta_title: string;

	@IsOptional()
	meta_description: string;

	@IsOptional()
	meta_image: string;

	@IsOptional()
	meta_keyword: string[];

	@IsOptional()
	canonical: string;
}
