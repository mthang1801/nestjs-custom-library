import { ENUM_ROLES } from '@app/shared/constants/enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserRoleDto {
	@IsNotEmpty()
	@IsEnum(ENUM_ROLES)
	name: ENUM_ROLES;

	@IsOptional()
	@IsString()
	description: string;
}
