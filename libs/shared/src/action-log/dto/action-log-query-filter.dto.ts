import { AbstractFilterQueryDto } from '@app/shared/abstract/dto/abstract-filter-query.dto';
import {
  ENUM_ACTION_LOG_DATA_SOURCE,
  ENUM_ACTION_TYPE,
} from '@app/shared/constants/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class ActionLogQueryFilterDto extends AbstractFilterQueryDto {
	@IsOptional()
	@ApiPropertyOptional()
	collection_name?: string;

	@IsOptional()
	@ApiPropertyOptional()
	@IsEnum(ENUM_ACTION_TYPE)
	action_type?: ENUM_ACTION_TYPE;

	@IsOptional()
	@ApiPropertyOptional()
	@IsEnum(ENUM_ACTION_LOG_DATA_SOURCE)
	data_source?: ENUM_ACTION_LOG_DATA_SOURCE;

	@IsOptional()
	@ApiPropertyOptional()
	created_by_user?: any;
}
