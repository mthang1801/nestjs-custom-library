import { AbstractService } from '@app/shared';
import { User, UserDocument } from '@app/shared/schemas';
import { UtilService } from '@app/shared/utils/util.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends AbstractService<UserDocument> {
	logger = new Logger(UserService.name);
	constructor(readonly userRepository: UserRepository) {
		super(userRepository);
    this.name = UserService.name;
	}

	async generateRawAndHashedPassword(password: string) {
		const rawPassword =
			password || this.utilService.generateRandomString({ length: 16 });
		const hashedPassword = await this.utilService.hashedString(rawPassword);

		return { rawPassword, hashedPassword };
	}

	async create(payload: CreateUserDto) {
		const { rawPassword, hashedPassword } =
			await this.generateRawAndHashedPassword(payload.password);

		const createdUser = await this._create({
			...payload,
			password: hashedPassword,
		});

		return createdUser;
	}

	async findUserByPhoneOrEmail(username: string) {
		const user = await this._findOne({
			$or: [{ email: username }, { phone: username }],
		});

		if (!user)
			throw new BadRequestException(
				await this.i18n.t('errors.alert_password_wrong'),
			);

		return user;
	}

	async saveRefreshToken(user: User, refreshToken: string) {
		await this._findByIdAndUpdate(
			user.id,
			{ refresh_token: refreshToken },
			{ enableSaveAction: false },
		);
	}

	async updateNewPasswordByUserId(userId: string, password: string) {
		await this._findByIdAndUpdate(userId, { password });
	}

	async findById(id: string): Promise<User> {
		return this._findById(id);
	}

	async findByRefreshToken(refreshToken: string): Promise<User> {
		return await this._findOne({
			refresh_token: refreshToken,
		});
	}
}
