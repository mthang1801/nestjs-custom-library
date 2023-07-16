import { AbstractService } from '@app/shared';
import { UserRoleDocument } from '@app/shared/schemas';
import { Injectable, Logger } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRoleRepository } from './user-roles.repository';

@Injectable()
export class UserRolesService extends AbstractService<UserRoleDocument> {
	logger = new Logger(UserRolesService.name);
	constructor(private readonly userRoleRepository: UserRoleRepository) {
		super(userRoleRepository);
	}
	create(createUserRoleDto: CreateUserRoleDto) {
		return this.userRoleRepository.create(createUserRoleDto);
	}

	findAll() {
		return `This action returns all userRoles`;
	}

	findOne(filterQuery: FilterQuery<any>) {
		return this._findOne(filterQuery);
	}

	update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
		return `This action updates a #${id} userRole`;
	}

	remove(id: number) {
		return `This action removes a #${id} userRole`;
	}
}
