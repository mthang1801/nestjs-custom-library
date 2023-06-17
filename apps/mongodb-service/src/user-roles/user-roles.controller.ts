import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRolesService } from './user-roles.service';

@Controller('user-roles')
export class UserRolesController {
	constructor(private readonly userRolesService: UserRolesService) {}

	@Post()
	create(@Body() createUserRoleDto: CreateUserRoleDto) {
		return this.userRolesService.create(createUserRoleDto);
	}

	@Get()
	findAll() {
		return this.userRolesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userRolesService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateUserRoleDto: UpdateUserRoleDto,
	) {
		return this.userRolesService.update(+id, updateUserRoleDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userRolesService.remove(+id);
	}
}
