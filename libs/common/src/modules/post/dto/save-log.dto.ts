import { ENUM_ACTION_TYPE } from '@app/shared/constants/enum';
import { IsOptional } from 'class-validator';

export class SaveLogDto {
	@IsOptional()
	new_data: any;

	@IsOptional()
	old_data: any;

	@IsOptional()
	custom_data: any;

	@IsOptional()
	action_type: keyof typeof ENUM_ACTION_TYPE;
}
