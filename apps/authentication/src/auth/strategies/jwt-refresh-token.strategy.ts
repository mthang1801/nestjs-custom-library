import { TokenPayload } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENUM_TOKEN_TYPE } from '../../../../../libs/common/src/constants/enum';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh-token',
) {
	constructor(
		readonly configService: ConfigService,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => req.cookies?.[ENUM_TOKEN_TYPE.REFRESH],
			]),
			secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: TokenPayload) {
		console.log('validatevalidatevalidate::', request);
		const refreshToken = request.cookies?.[ENUM_TOKEN_TYPE.REFRESH];
		return this.userService.getUserByRefreshToken(refreshToken, payload.id);
	}
}
