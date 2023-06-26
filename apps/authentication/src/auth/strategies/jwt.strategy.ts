import { TokenPayload } from '@app/common';
import { ENUM_TOKEN_TYPE, ENUM_TOKEN_VALUE } from '@app/common/constants/enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => req.cookies?.[ENUM_TOKEN_VALUE.ACCESS_TOKEN],
			]),
			secretOrKeyProvider: (
				req: Request,
				rawJwtToken: any,
				done: (err: any, secretOrKey: string) => void,
			) => {
				const secret = this.configService.get<string>(
					`JWT_${ENUM_TOKEN_TYPE.ACCESS}_SECRET`,
				);
				return done(null, secret);
			},
			passReqToCallback: true,
			ignoreExpiration: false,
		});
	}

	public async validate(request: Request, { id }: TokenPayload) {
		return await this.userService.findById(id);
	}
}
