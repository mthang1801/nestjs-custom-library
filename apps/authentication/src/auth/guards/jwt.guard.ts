import { PERMISSION } from '@app/common/constants/enum';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			PERMISSION.IS_PUBLIC_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (isPublic) return true;

		return super.canActivate(context);
	}

	handleRequest<TUser = any>(
		err: any,
		user: any,
		info: any,
		context: ExecutionContext,
		status?: any,
	): TUser {
		if (err || !user) {
			throw new UnauthorizedException('Bạn không có quyền truy cập');
		}

		return user;
	}
}
