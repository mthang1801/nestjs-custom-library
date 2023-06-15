import { QueryFilterAbstractDto } from '@app/common';
import { ENUM_STATUS } from '@app/common/constants/enum';
import { IsEnum, IsOptional } from 'class-validator';

export class FindProductDto extends QueryFilterAbstractDto {
	@IsOptional()
	@IsEnum(Object.values(ENUM_STATUS))
	status: ENUM_STATUS;
}
