import { User } from '@app/common/schemas';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.respository';

@Injectable()
export class UsersService {
	constructor(private readonly userRepository: UserRepository) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const createUser = await this.userRepository.create(createUserDto);
		return createUser;
	}

	async findAll(filter?: object) {
		return await this.userRepository.find(
			{},
			{},
			{ skip: 0, limit: 4, populate: ['role'] },
		);
	}

	async findOne(id: string) {
		return await this.userRepository.findById(id);
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
