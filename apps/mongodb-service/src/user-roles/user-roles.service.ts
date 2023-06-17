import { Injectable } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRoleRepository } from './user-roles.repository';

@Injectable()
export class UserRolesService {
	constructor(private readonly userRoleRepository: UserRoleRepository) {}
	create(createUserRoleDto: CreateUserRoleDto) {
		return this.userRoleRepository.create(createUserRoleDto);
	}

	findAll() {
		return `This action returns all userRoles`;
	}

	findOne(id: number) {
		return `This action returns a #${id} userRole`;
	}

	update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
		return `This action updates a #${id} userRole`;
	}

	remove(id: number) {
		return `This action removes a #${id} userRole`;
	}
}
