import {
  Body,
  Controller,
  Post
} from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UserRolesService } from './user-roles.service';

@Controller('user-roles')
export class UserRolesController {
	constructor(private readonly userRolesService: UserRolesService) {}

	@Post()
	create(@Body() createUserRoleDto: CreateUserRoleDto) {
		return this.userRolesService.create(createUserRoleDto);
	}
}
