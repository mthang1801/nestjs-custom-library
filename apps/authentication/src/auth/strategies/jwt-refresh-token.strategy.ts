import { TokenPayload } from '@app/shared';
import { ENUM_TOKEN_TYPE, ENUM_TOKEN_VALUE } from '@app/shared/constants/enum';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
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
				(req: Request) => req.cookies?.[ENUM_TOKEN_VALUE.REFRESH_TOKEN],
			]),
			secretOrKeyProvider: (
				request: Request,
				rawJwtToken: any,
				done: (err: any, secretOrKey?: any) => void,
			) => {
				const secret = configService.get<string>(
					`JWT_${ENUM_TOKEN_TYPE.REFRESH}_SECRET`,
				);
				done(null, secret);
			},
			passReqToCallback: true,
			ignoreExpiration: false,
		});
	}

	public async validate(request: Request, { id }: TokenPayload) {
		try {
			if (!id) throw new UnauthorizedException('Truy cập bị từ chối');
			const refreshToken = request.cookies?.[ENUM_TOKEN_VALUE.REFRESH_TOKEN];
			if (!refreshToken) throw new UnauthorizedException('Truy cập bị từ chối');
			return this.userService.findUserIfRefreshTokenMatching(refreshToken, id);
		} catch (error) {
			console.log(error.stack);
			throw new UnauthorizedException('Truy cập bị từ chối');
		}
	}
}
