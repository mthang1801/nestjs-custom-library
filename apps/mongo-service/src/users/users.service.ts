import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
	constructor(private readonly userRepository: UserRepository) {}

	async create(createUserDto: CreateUserDto) {
		const createUser = new this.userRepository.primaryModel(createUserDto);
		return await createUser.save();
	}

	async findAll() {
		return this.userRepository.find({});
	}

	async findById(id: string) {
		return await this.userRepository.findOne({ _id: id });
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
