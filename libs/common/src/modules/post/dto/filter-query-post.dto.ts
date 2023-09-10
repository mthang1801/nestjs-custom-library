import { AbstractFilterQueryDto } from '@app/shared/abstract/dto/abstract-filter-query.dto';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PostFilterQueryDto extends AbstractFilterQueryDto {
	@IsOptional()
	from_likes?: number;

	@IsOptional()
	to_likes?: number;

	@IsOptional()
	likes?: number;

	@IsOptional()
	@Transform(({ value }) => value.split(','))
	in_meta_keywords: string[];

	@IsOptional()
	@Transform(({ value }) => value.split(','))
	all_meta_keywords: string[];

	@IsOptional()
	@Transform(({ value }) => value.split(','))
	elemMatch_meta_keywords: string[];

	constructor() {
		super();
		this.searchFields = ['title', 'content'];
		this.sortFields = {
			likes: -1,
			rating: -1,
			updated_at: -1,
			created_at: -1,
		};
		this.excludedFields = ['created_by_user'];
		// this.projectFields = {
		// 	title: 1,
		// 	content: 1,
		// 	likes: 1,
		// 	shares: 1,
		// 	score: 1,
		// };
		// this.addFields = {
		// 	score: {
		// 		$divide: ['$likes', 1000],
		// 	},
		// };
	}

	protected override setValueForElemMatchOperator(value: string) {
		return value;
	}
}
