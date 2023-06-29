import { ENUM_TOKEN_VALUE, PERMISSION } from '@app/shared/constants/enum';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private readonly reflector: Reflector,
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (this.isPublic(context)) return true;
		const { cookies } = context.switchToHttp().getRequest();
		if (!cookies?.[ENUM_TOKEN_VALUE.ACCESS_TOKEN]) {
			return await this.canActivateByRefreshToken(context);
		}
		return super.canActivate(context) as Promise<boolean>;
	}

	private isPublic(context: ExecutionContext) {
		return this.reflector.getAllAndOverride<boolean>(PERMISSION.IS_PUBLIC_KEY, [
			context.getHandler(),
		]);
	}

	async canActivateByRefreshToken(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		const currentRefreshToken =
			request.cookies?.[ENUM_TOKEN_VALUE.REFRESH_TOKEN];
		if (!currentRefreshToken) {
			return false;
		}

		try {
			const user = await this.userService.findUserByRefreshToken(
				currentRefreshToken,
			);
			await this.authService.generateAndSaveToken(user, response);
			return true;
		} catch (error) {
			return false;
		}
	}
}
