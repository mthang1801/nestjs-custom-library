import { TokenPayload } from '@app/common';
import { User } from '@app/common/schemas';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		readonly ConfigService: ConfigService,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					console.log(req.cookies);
					return req.cookies?.Authentication;
				},
			]),
			secretOrKey: ConfigService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
		});
	}

	public async validate(payload: TokenPayload): Promise<User> {
		return this.userService.findById(payload.id);
	}
}
