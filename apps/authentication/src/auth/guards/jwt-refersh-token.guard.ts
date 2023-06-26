import { PERMISSION } from '@app/common/constants/enum';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshTokenAuthGuard extends AuthGuard('jwt-refresh-token') {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		if (this.isPublic(context)) return true;
		return super.canActivate(context);
	}

	isPublic(context: ExecutionContext) {
		return this.reflector.getAllAndOverride<boolean>(PERMISSION.IS_PUBLIC_KEY, [
			context.getHandler(),
		]);
	}
}
