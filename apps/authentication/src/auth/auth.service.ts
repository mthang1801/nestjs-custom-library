import { CookieToken, TokenPayload } from '@app/common';
import { User } from '@app/common/schemas';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	public async register(registrationData: RegisterDto) {
		const hashedPassword = await hash(registrationData.password, 10);
		const createdUser = await this.userService.create({
			...registrationData,
			password: hashedPassword,
		});
		return createdUser;
	}

	public async getAuthenticatedUser(email: string, password: string) {
		const userByEmail = await this.userService.getByEmail(email);
		await this.verifyPassword(password, userByEmail.password);
		return userByEmail;
	}

	private async verifyPassword(
		inputPassword: string,
		currentPassword: string,
	): Promise<void> {
		const isPasswordMatching = compare(inputPassword, currentPassword);
		if (!isPasswordMatching)
			throw new BadRequestException('Wrong credentials providerd');
	}

	public async getCookieToken(user: User): Promise<CookieToken> {
		const payload: TokenPayload = { _id: user._id.toString() };
		const token = await this.jwtService.signAsync(payload);
		return {
			token,
			cookie: `Authentication=${token};HttpOnly;Path=/;Max-Age=${this.configService.get<number>(
				'JWT_EXPIRATION_TIME',
			)}`,
		};
	}

	create(createAuthDto: CreateAuthDto) {
		return 'This action adds a new auth';
	}

	findAll() {
		return `This action returns all auth`;
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`;
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`;
	}

	remove(id: number) {
		return `This action removes a #${id} auth`;
	}
}
