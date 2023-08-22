import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class AbstractFilterQueryDto {
	@IsOptional()
	@Transform(({ value }) => Number(value))
	page?: number;

	@IsOptional()
	@Transform(({ value }) => Number(value))
	limit?: number;

	@IsOptional()
	@Transform(({ value }) => value && new Date(value))
	from_date?: Date;

	@IsOptional()
	@Transform(({ value }) => value && new Date(value))
	to_date?: Date;

	@IsOptional()
	status?: string;

	@IsOptional()
	@IsString()
	q?: string;
}
