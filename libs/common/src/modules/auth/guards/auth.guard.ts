import { TokenPayload, TokenType } from '@app/shared';
import { ENUM_TOKEN_TYPE, PERMISSION } from '@app/shared/constants/enum';
import { IUserRequest } from '@app/shared/interfaces';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly configSerice: ConfigService,
		private readonly jwtService: JwtService,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (this.isPublic(context)) return true;
		const request: IUserRequest = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) return false;
		try {
			const payload = await this.verifyToken(token, request);
			const user = await this.userService.findById(payload.id);
			if (!user) return false;
			request.user = user;
			this.determineUserActionByMethod(request);
		} catch (error) {
			return false;
		}
		return true;
	}

	private isPublic(context: ExecutionContext) {
		return this.reflector.getAllAndOverride<boolean>(PERMISSION.IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	async verifyToken(token: string, request: Request): Promise<TokenPayload> {
		const { tokenType, secretToken } = await this.getSecretTokenByRoutePath(
			request.path,
			token,
		);

		if (tokenType === 'REFRESH_TOKEN') {
			await this.validateRefreshToken(token);
		}

		return await this.jwtService.verifyAsync(token, {
			secret: secretToken,
			ignoreExpiration: false,
		});
	}

	getSecretTokenByRoutePath(path: string, token) {
		const refreshTokenRoutePath = ['/api/v1/auth/refresh-token'];
		const getSecretTokenByType = (tokenType: TokenType) => {
			return {
				tokenType,
				secretToken: this.configSerice.get<string>(`JWT_${tokenType}_SECRET`),
			};
		};

		return refreshTokenRoutePath.some((refreshpath) =>
			new RegExp(refreshpath).test(path),
		)
			? getSecretTokenByType(ENUM_TOKEN_TYPE.REFRESH)
			: getSecretTokenByType(ENUM_TOKEN_TYPE.ACCESS);
	}

	async validateRefreshToken(refreshToken: string) {
		const userByRefreshToken = await this.userService.findByRefreshToken(
			refreshToken,
		);
		if (!userByRefreshToken) throw new NotFoundException();
	}

	determineUserActionByMethod = ({
		method,
		body,
		user,
		query,
	}: IUserRequest) => {
		switch (method) {
			case 'POST':
				{
					body.created_by_user = user?.id;
					body.updated_by_user = user?.id;
				}
				break;
			case 'DELETE':
				{
					body.deleted_by_user = user?.id;
					query.deleted_by_user = user?.id;
				}
				break;
			case 'PATCH':
			case 'PUT':
				{
					body.updated_by_user = user?.id;
				}
				break;
			case 'GET': {
				query.created_by_user = user?.id;
			}
		}
	};
}
