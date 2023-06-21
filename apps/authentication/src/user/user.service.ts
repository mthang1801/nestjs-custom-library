import { User, UserDocument } from '@app/common/schemas';
import { AbstractService } from '@app/shared';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends AbstractService<UserDocument> {
	protected logger = new Logger(UserService.name);

	constructor(readonly userRepository: UserRepository) {
		super(userRepository);
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		return this._create(createUserDto);
	}

	async getByEmail(email: string): Promise<User> {
		const userByEmail = await this.userRepository.findOne({ email });
		if (!userByEmail) throw new NotFoundException('User Not Found');
		return userByEmail;
	}

	findAll() {
		return `This action returns all user`;
	}

	findById(id: ObjectId | string | any) {
		return this._findById(id);
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
