import { TokenPair, TokenPayload, TokenType } from '@app/shared';
import { ENUM_TOKEN_TYPE } from '@app/shared/constants/enum';
import { User } from '@app/shared/schemas';
import { UtilService } from '@app/shared/utils/util.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { UserService } from '../user/user.service';
import { SetPasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly utilService: UtilService,
		private readonly i18n: I18nService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async validateUser(username: string, password: string) {
		const user = await this.userService.findUserByPhoneOrEmail(username);

		const passwordIsMatching = await this.utilService.compareHashedString(
			password,
			user.password,
		);
		if (!passwordIsMatching)
			throw new BadRequestException(
				await this.i18n.t('errors.alert_password_wrong'),
			);

		return user;
	}

	async generateTokenByTokenType(
		user: User,
		tokenType: TokenType = ENUM_TOKEN_TYPE.ACCESS,
	): Promise<any> {
		const payload: TokenPayload = { id: user.id.toString() };
		const secret = this.configService.get<string>(`JWT_${tokenType}_SECRET`);

		const expirationTime = this.configService.get<number>(
			`JWT_${tokenType}_EXPIRATION_TIME`,
		);
		const token = await this.jwtService.signAsync(payload, {
			secret,
			expiresIn: `${expirationTime}s`,
		});

		return token;
	}

	async generateTokenPair(user: User): Promise<TokenPair> {
		const [accessToken, refreshToken] = await Promise.all(
			[ENUM_TOKEN_TYPE.ACCESS, ENUM_TOKEN_TYPE.REFRESH].map(async (tokenType) =>
				this.generateTokenByTokenType(user, tokenType),
			),
		);

		await this.userService.saveRefreshToken(user, refreshToken);
		return { accessToken, refreshToken };
	}

	async setPassword(payload: SetPasswordDto) {
		const user = await this.userService.findUserByPhoneOrEmail(
			payload.username,
		);
		const { rawPassword, hashedPassword } =
			await this.userService.generateRawAndHashedPassword(payload.password);

		this.userService.updateNewPasswordByUserId(user.id, hashedPassword);
	}
}
