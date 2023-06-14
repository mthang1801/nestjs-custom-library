import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class QueryFilterAbstractDto {
	@IsOptional()
	@Type(() => Number)
	page: number;

	@IsOptional()
	@Type(() => Number)
	limit: number;

	@IsOptional()
	@IsString()
	q: string;
}
