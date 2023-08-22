import { ENUM_ACTION_TYPE } from '@app/shared/constants/enum';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SaveCustomActionLogDto {
	@IsOptional()
	@IsEnum(ENUM_ACTION_TYPE)
	action_type: ENUM_ACTION_TYPE;

	@IsNotEmpty()
	custom_data: any;

	@IsOptional()
	collection_name: string;
}
