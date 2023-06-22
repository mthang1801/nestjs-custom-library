import { CookieToken, TokenPayload } from '@app/common';
import { ENUM_TOKEN_TYPE } from '@app/common/constants/enum';
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
		const payload: TokenPayload = { id: user.id.toString() };
		const token = await this.jwtService.signAsync(payload);
		return {
			token,
			cookie: `Authentication=${token};HttpOnly;Path=/;Max-Age=${this.configService.get<number>(
				'JWT_EXPIRATION_TIME',
			)}`,
		};
	}

	public async getCookieWithJwtToken(user: User, tokenType: ENUM_TOKEN_TYPE) {
		const tokenScret = this.configService.get<string>(
			tokenType === ENUM_TOKEN_TYPE.ACCESS
				? 'JWT_ACCESS_TOKEN_SECRET'
				: 'JWT_REFRESH_TOKEN_SECRET',
		);

		const tokenExpiration = this.configService.get<number>(
			tokenType === ENUM_TOKEN_TYPE.ACCESS
				? 'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
				: 'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
		);

		const payload: TokenPayload = { id: user.id.toString() };
		const token = await this.jwtService.signAsync(payload, {
			secret: tokenScret,
			expiresIn: `${tokenExpiration}s`,
		});

		console.log(
			ENUM_TOKEN_TYPE,
			tokenType,
			ENUM_TOKEN_TYPE[tokenType],
			tokenExpiration,
		);

		const cookie = `${ENUM_TOKEN_TYPE[tokenType]}=${token};HttpOnly;Path=/;Max-Age=${tokenExpiration}`;

		return { token, cookie };
	}

	getCookiesForLogout() {
		return [ENUM_TOKEN_TYPE.ACCESS, ENUM_TOKEN_TYPE.REFRESH].map(
			(tokenType) => `${tokenType}=;OnlyHttp;Path=/;Max-Age=0`,
		);
	}

	async removeRefreshToken(user: User): Promise<any> {
		return this.userService.removeRefreshTokenByUserId(user.id);
	}

	async login(user: User) {
		const [cookieWithAccessToken, cookieWithRefreshToken] = await Promise.all([
			this.getCookieWithJwtToken(user, ENUM_TOKEN_TYPE.ACCESS),
			this.getCookieWithJwtToken(user, ENUM_TOKEN_TYPE.REFRESH),
		]);
		await this.userService.setCurrentRefreshToken(
			cookieWithRefreshToken.token,
			user.id,
		);

		return {
			cookieWithAccessToken: cookieWithAccessToken.cookie,
			cookieWithRefreshToken: cookieWithRefreshToken.cookie,
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
