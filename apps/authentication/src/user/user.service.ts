import { ENUM_ROLES } from '@app/common/constants/enum';
import { User, UserDocument } from '@app/common/schemas';
import utils from '@app/common/utils';
import { AbstractService } from '@app/shared';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRoleRepository } from 'apps/mongodb-service/src/user-roles/user-roles.repository';
import { UserRepository } from 'apps/mongodb-service/src/users/user.respository';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/register.dto';
@Injectable()
export class UserService extends AbstractService<UserDocument> {
	protected logger = new Logger(UserService.name);

	constructor(
		private readonly userRepository: UserRepository,
		private readonly userRoleRepository: UserRoleRepository,
	) {
		super(userRepository);
	}

	async create(payload: RegisterDto): Promise<User> {
		const role = await this.userRoleRepository.findOne({
			name: ENUM_ROLES.USER,
		});

		const hashedPassword = await utils.hashedString(payload.password);

		return await this.userRepository.create({
			...payload,
			password: hashedPassword,
			role,
		});
	}

	async validateUserByEmailPassword(
		email: string,
		password: string,
	): Promise<User> {
		const userByEmail = await this._findOne({ email });
		if (!userByEmail)
			throw new BadRequestException('Tài Khoản hoặc mật khẩu không đúng.');

		const isPasswordMatching = await utils.compareHashedString(
			password,
			userByEmail.password,
		);
		if (!isPasswordMatching)
			throw new BadRequestException('Tài Khoản hoặc mật khẩu không đúng.');

		return userByEmail;
	}

	async findById(id): Promise<User> {
		const user = await this._findById(id);
		if (!user) throw new BadRequestException('Người dùng không tồn tại');
		return user;
	}

	async findUserIfRefreshTokenMatching(refreshToken: string, userId: string) {
		const user = await this.findById(userId);

		const isRefreshTokenMatching = await bcrypt.compare(
			refreshToken,
			user.refresh_token,
		);
		if (!isRefreshTokenMatching)
			throw new UnauthorizedException('Token không hợp lệ');
		return user;
	}

	async updateById(id: string, payload: Partial<UserDocument>) {
		return this._findByIdAndUpdate(id, payload);
	}

	async setCurrentRefreshToken(token, userId) {
		return this.userRepository.findByIdAndUpdate(userId, {
			refresh_token: token,
		});
	}

	async removeRefreshTokenByUserId(userId: string) {
		return this._findByIdAndUpdate(userId, { refresh_token: null });
	}

	async findUserByRefreshToken(refreshToken: string) {
		const user = await this.userRepository.findOne({
			refresh_token: refreshToken,
		});

		if (!user) throw new BadRequestException('Người dùng không tồn tại');

		return user;
	}
}

//$2a$10$hH7QyRKWT.CbcXAGr6687uD/QIwSd8ewPs1qXZeU5Cm35HeSFz1aK

