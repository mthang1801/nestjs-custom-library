import { AbstractFilterQueryDto } from '@app/shared/abstract/dto/abstract-query-filter.dto';
import {
	ENUM_ACTION_LOG_DATA_SOURCE,
	ENUM_ACTION_TYPE,
} from '@app/shared/constants/enum';
import { IsEnum, IsOptional } from 'class-validator';

export class ActionLogQueryFilterDto extends AbstractFilterQueryDto {
	@IsOptional()
	collection_name: string;

	@IsOptional()
	@IsEnum(ENUM_ACTION_TYPE)
	action_type: ENUM_ACTION_TYPE;

	@IsOptional()
	@IsEnum(ENUM_ACTION_LOG_DATA_SOURCE)
	data_source: ENUM_ACTION_LOG_DATA_SOURCE;
}
