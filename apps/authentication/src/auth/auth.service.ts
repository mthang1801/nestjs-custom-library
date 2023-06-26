import { CookieToken, TokenPayload } from '@app/common';
import { ENUM_TOKEN_TYPE, ENUM_TOKEN_VALUE } from '@app/common/constants/enum';
import { User } from '@app/common/schemas';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}

	async register(registerDto: RegisterDto): Promise<User> {
		return this.userService.create(registerDto);
	}

	async getCookieWithToken(
		user: User,
		tokenType: ENUM_TOKEN_TYPE = ENUM_TOKEN_TYPE.ACCESS,
	): Promise<CookieToken> {
		const payload: TokenPayload = { id: user.id.toString() };
		const secret = this.configService.get<string>(`JWT_${tokenType}_SECRET`);
		const expirationTime = this.configService.get<number>(
			`JWT_${tokenType}_EXPIRATION_TIME`,
		);

		const token = await this.jwtService.signAsync(payload, { secret });
		const cookie = `${ENUM_TOKEN_VALUE[tokenType]}=${token};HttpOnly;Path=/;Max-Age=${expirationTime}`;

		console.log(ENUM_TOKEN_VALUE[tokenType]);

		if (tokenType === ENUM_TOKEN_TYPE.REFRESH) {
			await this.userService.updateById(user.id, { refresh_token: token });
		}

		console.log(cookie, token);

		return { token, cookie };
	}

	async getCookieForLogout(user: User) {
		await this.userService.removeRefreshTokenByUserId(user.id);
		return [
			`${ENUM_TOKEN_VALUE.ACCESS_TOKEN}=;HttpOnly;Path=/;Max-Age=0`,
			`${ENUM_TOKEN_VALUE.REFRESH_TOKEN}=;HttpOnly;Path=/;Max-Age=0`,
		];
	}

	async genTokenPairFromRefreshToken(refershToken: string): Promise<{
		accessCookieToken: CookieToken;
		refreshCookieToken: CookieToken;
	}> {
		const user = await this.userService.findUserByRefreshToken(refershToken);
		const [accessCookieToken, refreshCookieToken] = await Promise.all([
			this.getCookieWithToken(user, ENUM_TOKEN_TYPE.ACCESS),
			this.getCookieWithToken(user, ENUM_TOKEN_TYPE.REFRESH),
		]);

		return { accessCookieToken, refreshCookieToken };
	}

	async generateAndSaveToken(user: User, response: Response) {
		const [
			{ cookie: accessCookie },
			{ token: refreshToken, cookie: refreshCookie },
		] = await Promise.all([
			this.getCookieWithToken(user, ENUM_TOKEN_TYPE.ACCESS),
			this.getCookieWithToken(user, ENUM_TOKEN_TYPE.REFRESH),
		]);
		await this.userService.setCurrentRefreshToken(refreshToken, user.id);
		response.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
	}
}
