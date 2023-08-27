import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AbstractCreate {
	@IsOptional()
	status?: string;

	@IsOptional()
	@ApiPropertyOptional()
	created_by_user?: string;

	@IsOptional()
	@ApiPropertyOptional()
	updated_by_user?: string;

	@IsOptional()
	@ApiPropertyOptional()
	deleted_by_user?: string;
}
