import { User, UserDocument } from '@app/common/schemas';
import { AbstractService } from '@app/shared';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
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

	async setCurrentRefreshToken(refreshToken: string, userId: string) {
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
		await this._update(
			{ _id: userId },
			{ $set: { refresh_token: hashedRefreshToken } },
		);
	}

	public async getUserByRefreshToken(refreshToken: string, userId: string) {
		const user = await this._findById(userId);
		console.log('getUserByRefreshToken::', user);
		const isRefreshTokenMatching = await bcrypt.compare(
			refreshToken,
			user.refresh_token,
		);

		if (!isRefreshTokenMatching) throw new BadRequestException('Invalid Token');

		return user;
	}

	async removeRefreshTokenByUserId(userId: string): Promise<any> {
		return this._update({ _id: userId }, { $set: { refresh_token: null } });
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
