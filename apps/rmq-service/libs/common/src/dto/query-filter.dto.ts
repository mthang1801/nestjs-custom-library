import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class QueryFilterAbstractDto {
	@IsOptional()
	@Type(() => Number)
	page: number;

	@IsOptional()
	@Type(() => Number)
	limit: number;

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	is_paging: boolean;

	@IsOptional()
	@IsString()
	q: string;
}
