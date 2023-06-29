import { User } from '@app/shared/schemas';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../../user/user.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UserService) {
		super({
			usernameField: 'email',
		});
	}

	public async validate(email: string, password: string): Promise<User> {
		return this.userService.validateUserByEmailPassword(email, password);
	}
}
